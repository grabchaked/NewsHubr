var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    img_url:{
        type:String,
        required:true
    },
    author:{
        type:String
    },
    created:{
		type: Date,
		default: Date.now
	}
});

var Post = module.exports = mongoose.model('Post', postSchema);
