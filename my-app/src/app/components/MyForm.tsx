"use client"

import {useState} from "react"
import  {TextField, Button, Box} from "@mui/material"
import FormBuilder from "./FormBuilder"
import { json } from "stream/consumers"



//Add Endorsement Object here
type Endorsement ={
    endorsementID: string
    ticketID: string
    subject: string
    notes: string

}

export type FormField = {
    id: string
    type: "notes" | "code" | "image"
    value: string
}


//Fucntion to generate the Endorsement Form
export default function EndorsementForm(){
    const [endorsement, setEndorsement] = useState<Endorsement>({
        endorsementID: "",
        ticketID: "",
        subject: "",
        notes: ""



    })

    const [dynamicFields, setDynamicFields] = useState<FormField[]>([])

    const handleSubmit = async () => {
        const endorsementData = {
            ...endorsement,
            dynamicFields
        }

        console.log("Submitting:", endorsementData)

        try {
            const res = await fetch("/api/save-form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(endorsementData)
            })

            const data = await res.json()

            if (data.success) {
                alert("✅ Saved to MongoDB!")
            } else {
                alert("❌ Failed to save")
            }
        } catch (err) {
            console.error(err)
            alert("❌ Error submitting form")
        }
    }

    return(
        <Box 
        display="flex"
        justifyContent="center"
        alignItems="center"
        >
            <Box display="flex" 
            flexDirection={"column"} 
            gap={2} width={"500px"}>
                <h1>Create an Endorsement</h1>
                <TextField label="ID"
                 id="endorsementID"
                 value={endorsement.endorsementID}
                 required
                 onChange={ (e) =>
                    setEndorsement({...endorsement, endorsementID: e.target.value})
                 }
                 ></TextField>

                <TextField label="Ticket ID"
                 id="ticketID"
                 value={endorsement.ticketID}
                 required
                 onChange={ (e) => 
                    setEndorsement({...endorsement, ticketID: e.target.value})
                 }
                 ></TextField>

                <TextField label="Subject" 
                id="subject"
                value={endorsement.subject}
                required
                onChange={ (e) =>
                    setEndorsement({...endorsement, subject: e.target.value})
                }></TextField>

                

                <Box>
                    <FormBuilder
                    fields={dynamicFields}
                    setFields={setDynamicFields}
                    ></FormBuilder>
                </Box>

                <Button 
                variant="contained"
                onClick={handleSubmit}
                >CREATE</Button>
                


            </Box>
        </Box>

            
    )
}
