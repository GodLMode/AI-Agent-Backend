import {inngest} from '../inngest/client.js';
import {Ticket} from '../models/ticket.model.js';

export const createTicket = async(req ,res)=>{
    try{
        const {title , description} = req.body 
        if(!title || !description){
            return res.status(400).json({message :
                "Title and description are required"
            })
        }
        const newTicket = Ticket.create({
            title,
            description,
            createdBy:req.user._id.toString()
        })

        await inngest.send({
            name:"ticket/created",
            data:{
                ticketId:(await newTicket)._id.toString(),
                title,
                description,
                createdBy:req.user._id.toString()
            }
        });

        return res.status(201).json({
            message:"Ticket created and processed started",
            ticket :newTicket
        })
    }
    catch(error){
        console.log("error creating ticket !!!",error);
        return res.status(500)
                  .json({message:"Internal Server error while creating ticket"});
    }
};

export const getTickets = async(req,res)=>{
    try {
        const user = req.user
        let tickets = []
        if(user.role !== "user"){
            tickets = Ticket.find({})
            .populate("assignedTo",["email","_id"])
            .sort({createdAt:-1}) 
        }else{
            tickets = await Ticket.find({createdBy:user._id})
                  .select("title description status createdAt")
                  .sort({createdAt:-1})
        }
        return res.status(200).json(tickets)
    } catch (error) {
        console.log("error fetching tickets !!!",error);
        return res.status(500)
                  .json({message:"Internal Server error while fetching tickets"});
    }
};


export const getTicket = async(req,res)=>{
    try {
        const user = req.user 
        let ticket ;
        if(user.role !== "user"){
            ticket = await Ticket.findById(req.params.id)
                        .populate("assignedTo",["email","_id"])
        }else{
            ticket = await Ticket.findOne({
                createdBy:user._id,
                _id:req.params.id
            })
            .select("title description status createdAt")
        }

        if(!ticket){
            return res.status(404).json({message:"Ticket not found"});
        }
        return res.status(200).json({ticket});
    } catch (error) {
        console.log("Error fetching a ticket",error);
        return res.status(500).json({
            message:"Internal Server Error while fetching a ticket"
        });
    }
};