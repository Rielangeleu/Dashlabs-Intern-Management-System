"use client"

import {useState} from "react"
import  {TextField, Button, Box} from "@mui/material"
import FormBuilder from "./FormBuilder"



//Add Endorsement Object here
type Endorsement ={
    endorsementID: string
    ticketID: string
    subject: string
    notes: string

}




//Fucntion to generate the Endorsement Form
export default function EndorsementForm(){
    const [endorsement, setEndorsement] = useState<Endorsement>({
        endorsementID: "",
        ticketID: "",
        subject: "",
        notes: ""



    })

    const handleSubmit = () => {
        console.log(endorsement)

        //add mongoDB Write Here
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
                    <FormBuilder></FormBuilder>
                </Box>

                <Button 
                variant="contained"
                onClick={handleSubmit}
                >CREATE</Button>
                


            </Box>
        </Box>

            
    )
}
