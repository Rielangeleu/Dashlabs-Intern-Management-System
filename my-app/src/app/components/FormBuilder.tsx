"use client"

import { useState } from "react"
import { TextField, Button, Box } from "@mui/material"


type FormField = {
    id: string
    type: "notes" | "code" | "image"
    value: string
}

export default function FormBuilder(){
    const [fields, setFields] = useState<FormField[]>([])

    const addField = (type: FormField["type"]) =>{
        const newField ={
            id: crypto.randomUUID(),
            type,
            value: ""
        }

        setFields([...fields, newField])
    }

    const updateField = (id: string, value: string) => {
        setFields(
            fields.map((field) =>
                field.id === id ? {...field, value}: field
            )
        )
    }

    const deleteField = (id: string) => {
        setFields( 
            fields.filter((field) => field.id != id))
    }


    return(
        <Box display={"flex"} gap={2} flexDirection={"column"} >

            <Box display={"flex"} flexDirection={"column"} width={"500px"}>
                {/*New Fields Rendering Setup*/}
                {fields.map((field) =>
                    <Box key={field.id} display={"flex"} alignItems={"center"} gap={2} width={"100%"} marginBottom={"20px"}>
                        {field.type === "notes" && (
                            <TextField
                            label="Notes"
                            value={field.value}
                            onChange={(e) => updateField(field.id, e.target.value)}
                            multiline
                            minRows={4}
                            fullWidth
                            />
                        )}

                        {field.type === "code" && (
                            <TextField
                            label="Code Snippet"
                            value={field.value}
                            onChange={(e) => updateField(field.id, e.target.value)}
                            multiline
                            minRows={4}
                            fullWidth
                            />
                        )}
                        
                        {field.type === "image" && (
                            <Box>
                                <input
                                type="file"
                                accept="file/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]

                                    if (!file) return

                                    const imageURL = URL.createObjectURL(file)
                                    
                                    updateField(field.id, imageURL)
                                }}>

                                </input>
                                {field.value && (
                                    <img
                                    src={field.value}
                                    style={{
                                        maxWidth: "200px",
                                        borderRadius: "5px",
                                        marginTop: "5px"
                                    }}
                                    />
                                )}

                            </Box>
                        )}
                        
                    <Button 
                    onClick={() => deleteField(field.id)}>X</Button>

                    </Box>
                )}
            </Box>

            <Box display={"flex"} gap={1}>
                <Button onClick={() => addField("notes")}>
                    ✎
                </Button>

                <Button onClick={() => addField("code")}>
                    {"</>"}
                </Button>

                <Button onClick={() => addField("image")}>
                    image
                </Button>

            </Box>
          
        </Box>
    )
}