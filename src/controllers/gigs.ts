import { Request, Response } from "express";
import logger from "../lib/logger";
import {
  createGig,
  editGig,
  findAllGigs,
  findGigById,
  findGigsByEmployerId,
  removeGig
} from "../models/queries/gigs";
import { GigSchema } from "../types/zod-validations/gig";
import { TGig } from "../models/schema/gigs";

export const getAllGigs = async (req: Request, res: Response) => {
  try {
    const gigs = await findAllGigs();
    if (!gigs) {
      return res.status(404).json({ message: "No gigs found" });
    }
    return res.status(200).json(gigs);
  } catch (error) {
    console.error(error);
    logger.error(error);
    return res.status(500).json({ message: "Failed to get all gigs", error });
  }
};
export const getGigById = async (req: Request, res: Response) => {
  try {
    const gigId = req.params.id;
    if (!gigId) {
      return res.status(400).json({ message: "No gig ID provided" });
    }
    const [gig] = await findGigById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    return res.status(200).json(gig);
  } catch (error) {
    console.error(error);
    logger.error(error);
    return res.status(500).json({ message: "Failed to get gig by ID", error });
  }
};

export const createNewGig = async (req: Request, res: Response) => {
  try {
    await GigSchema.parseAsync(req.body);
    const gigBody = (await req.body) as TGig;
    if (!gigBody) {
      return res.status(400).json({ message: "Invalid Data provided" });
    }
    const newGig = await createGig(gigBody);
    return res.status(201).json(newGig);
  } catch (error) {
    console.error(error);
    logger.error(error);
    return res.status(500).json({ message: "Failed to create new gig", error });
  }
};

export const updateGig = async (req: Request, res: Response) => {
  try {
    // await GigSchema.parseAsync(req.body);
    const gigId = req.params.id;
    const gigBody = (await req.body) as TGig;
    if (!gigId) {
      return res.status(400).json({ message: "No gig ID provided" });
    }
    const updatedGig = await editGig(gigId, gigBody);
    if (!updatedGig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    return res.status(201).json(updatedGig);
  } catch (error) {
    console.error(error);
    logger.error(error);
    return res.status(500).json({ message: "Failed to update gig", error });
  }
};

export const deleteGig = async (req:Request, res:Response) => {
  try {
    const gigId = req.params.id;
    if (!gigId) {
      return res.status(400).json({ message: "No gig ID provided" });
    }
    const [gig] = await findGigById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    const deletedGig = await removeGig(gigId);
    if (!deletedGig) {
       return res.status(404).json({ message: "Gig not found" });
    }
    
    return res.status(204).json({ message: "Gig deleted successfully" });
  } catch (error) {
    console.error(error);
    logger.error(error);
    return res.status(500).json({ message: "Failed to delete gig", error });
  }
}
export const getEmployerGigs = async (req:Request, res:Response) => {
  try{
    const employerId = req.params.id
    if(!employerId){
      return res.status(400).json({message: "No employer ID provided"})
    }
    const gigs = await findGigsByEmployerId(employerId)
    if(!gigs){
      return res.status(404).json({message: "Gigs not found"})
    }
    return res.status(200).json(gigs)
  }catch(error){
    console.error(error)
    logger.error(error)
    return res.status(500).json({message: "Failed to get employer gigs", error})
  }
}
