const ChatModel = require("../Model/ChatModels.js");

module.exports.createChat = async (req, res, next) => {
  const newChat = new ChatModel({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports.userChats = async (req, res, next) => {
  try {
    const chat = await ChatModel.find({
        members: {$in: [req.params.userId]}
    })

    res.status(200).json(chat);
    
  } catch (err) {
    next(err);
  }
};

module.exports.findChat = async (req,res,next) => {
    try{
        const chat = await ChatModel.findOne({
            members: {$all: [req.params.firstId, req.params.secondId]}
        })

        res.status(200).json(chat);
        
    } catch (err) {
    next(err);
  }
}
