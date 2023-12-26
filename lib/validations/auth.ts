import { z } from "zod";


export const signInWithEmailSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email' }),
})