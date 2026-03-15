import supabase from "../config/supabaseClient.js"

export const getBalance =async(req,res)=>{
    try {
        const {data,error} = await supabase
        .from('users').select('balance').eq('id',req.user.id).maybeSingle()

        if(error){
        return res.status(400).json({
            status:false,
            error: error.message
        })
    }
    if(!data || data.length === 0){
        return res.status(404).json({
            error:"Balance of this user are not found"
        })
    }
    res.status(200).json({
        status:true,
        message:"Balance are fetched successfully!",
        data
    }) 
    } catch (error) {
        res.status(500).json({
            status:false,
            error: error.message
        })
    }
}

export const sendMoney = async (req, res) => {
  const { receiver_email, amount } = req.body
  const sender_id = req.user.id

  if (!receiver_email || !amount) {
    return res.status(400).json({
      status: false,
      error: "receiver_email and amount are required"
    })
  }

  const parsedAmount = Number(amount)
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({
      status: false,
      error: "Amount must be a positive number"
    })
  }

  try {
  
    const { data: sender, error: senderError } = await supabase
      .from('users')
      .select('id, name, email, balance')
      .eq('id', sender_id)
      .maybeSingle()

    if (senderError) return res.status(400).json({ status: false, error: senderError.message })
    if (!sender)     return res.status(404).json({ status: false, error: "Sender not found" })

   
    if (sender.email === receiver_email) {
      return res.status(400).json({ status: false, error: "Cannot transfer to your own account" })
    }

   
    if (Number(sender.balance) < parsedAmount) {
      return res.status(400).json({
        status: false,
        error: `Insufficient balance. Available: ₹${sender.balance}`
      })
    }

   
    const { data: receiver, error: receiverError } = await supabase
      .from('users')
      .select('id, name, email, balance')
      .eq('email', receiver_email)
      .maybeSingle()

    if (receiverError) return res.status(400).json({ status: false, error: receiverError.message })
    if (!receiver)     return res.status(404).json({ status: false, error: "Receiver not found. They must be a registered user." })

    
    const senderBalanceAfter   = Number(sender.balance)   - parsedAmount
    const receiverBalanceAfter = Number(receiver.balance) + parsedAmount

    
    const { error: deductError } = await supabase
      .from('users')
      .update({ balance: senderBalanceAfter })
      .eq('id', sender.id)

    if (deductError) return res.status(400).json({ status: false, error: deductError.message })

   
    const { error: creditError } = await supabase
      .from('users')
      .update({ balance: receiverBalanceAfter })
      .eq('id', receiver.id)

    if (creditError) {
      
      await supabase.from('users').update({ balance: sender.balance }).eq('id', sender.id)
      return res.status(400).json({ status: false, error: creditError.message })
    }

    const now = new Date().toISOString()

    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert({
        sender_id:        sender.id,
        receiver_id:      receiver.id,
        amount:           parsedAmount,
        transaction_type: 'debit',
        balance_after:    senderBalanceAfter,
        created_at:       now
      })
      .select()
      .single()

    if (txError) return res.status(400).json({ status: false, error: txError.message })

    return res.status(201).json({
      status:  true,
      message: `₹${parsedAmount} sent successfully to ${receiver.name}`,
      data:    transaction
    })

  } catch (error) {
    return res.status(500).json({ status: false, error: error.message })
  }
}



export const getAccountStatement = async (req, res) => {
  const user_id = req.user.id

  try {
    
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        id,
        amount,
        transaction_type,
        balance_after,
        created_at,
        sender_id,
        receiver_id,
        sender:users!transactions_sender_id_fkey   ( id, name, email ),
        receiver:users!transactions_receiver_id_fkey ( id, name, email )
      `)
      .or(`sender_id.eq.${user_id},receiver_id.eq.${user_id}`)
      .order('created_at', { ascending: false })

    if (error) return res.status(400).json({ status: false, error: error.message })

    if (!transactions || transactions.length === 0) {
      return res.status(200).json({
        status:  true,
        message: "No transactions found",
        data:    []
      })
    }

    const statement = transactions.map((tx) => {
      const isSender = tx.sender_id === user_id

      const type         = isSender ? 'debit' : 'credit'
      const balance_after = isSender
        ? tx.balance_after
        : tx.balance_after !== null
          ? tx.balance_after + tx.amount   
          : null

      return {
        id:               tx.id,
        date:             tx.created_at,
        transaction_type: type,
        amount:           tx.amount,
        sender:           tx.sender   ? { name: tx.sender.name,   email: tx.sender.email }   : null,
        receiver:         tx.receiver ? { name: tx.receiver.name, email: tx.receiver.email } : null,
        balance_after
      }
    })

    return res.status(200).json({
      status:  true,
      message: "Account statement fetched successfully!",
      data:    statement
    })

  } catch (error) {
    return res.status(500).json({ status: false, error: error.message })
  }
}