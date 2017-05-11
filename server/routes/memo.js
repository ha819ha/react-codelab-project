import express from 'express';
import Memo from '../models/memo';
import mongoose from 'mongoose';

const router = express.Router();

// WRITE MEMO
router.post('/', (req, res) => {
    if(typeof req.session.loginInfo === "undefined"){
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 1
        });
    }
    if(typeof req.body.contents !== "string") {
        return res.status(403).json({
            error: "Empty Content",
            code: 2
        })
    }
    if(req.body.contents === "") {
        return res.status(400).json({
            error: "Empty Content",
            code: 2
        })
    }
    let memo = new Memo({
        writer: req.session.loginInfo.username,
        contents: req.session.loginInfo.contents
    });

    memo.save( err => {
        if(err) throw err;
        return res.json({success: true});
    });
});

// MODIFY MEMO
router.put('/:id', (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).json({
            error: "INVALID ID",
            code: 1
        });
    }
    if(typeof req.body.contents !== "string"){
        return res.status(400).json({
            error: "NO CONTENT",
            code: 2
        });
    }
    if(typeof req.session.loginInfo === "undefined"){
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 3
        })
    }
    Memo.findById(req.params.id,(err,memo)=>{
        if(err) throw err;

        if(!memo){
            return res.status(404).json({
                error: "NO RESOURCE",
                code: 4
            })
        }
        if(memo.writer !== req.session.loginInfo.username){
            return res.status(403).json({
                error: "PERMISSION FAILURE",
                code: 5
            });
        }

        memo.contents = req.body.contents;
        memo.date.edited = new Date();
        memo.is_edited = true;

        memo.save( err => {
            if(err) throw err;
            return res.json({
                success: true,
                memo
            })
        })
    })
});

// DELETE MEMO
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            error: "INVALID ID",
            code: 1
        })
    }
    if(typeof req.session.loginInfo === "undefined"){
        return res.status(403).json({
            error: "NOT LOGGED IN",
            code: 2
        })
    }
    Memo.findById(id,(err,memo)=>{
        if(err) throw err;
        if(!memo){
            return res.status(403).json({
                error: "NO RESOURCE",
                code: 3
            })
        }
        if(memo.writer !== req.session.loginInfo.username){
            return res.status(403).json({
                error: "PERMISSION FAILURE",
                code: 4
            });
        }
        Memo.remove({_id: req.params.id}, err => {
            if(err) throw err;
            res.json({success: true});
        });
    });
});

// GET MEMO LIST
router.get('/', (req, res) => {
    Memo.find()
    .sort({"_id": -1})
    .limit(6)
    .exec((err,memos)=>{
    if(err) throw err;
    res.json(memos);
    })
});

export default router;