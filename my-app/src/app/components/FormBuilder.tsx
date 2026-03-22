"use client";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input"; 
import { X, Code, FileText, Image as ImageIcon } from "lucide-react";

export type FormField = {
  id: string;
  type: "notes" | "code" | "image";
  value: string;
};

type FormBuilderProps = {
  fields: FormField[];
  setFields: React.Dispatch<React.SetStateAction<FormField[]>>;
};

export default function FormBuilder({ fields, setFields }: FormBuilderProps) {
  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      type,
      value: "",
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, value: string) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, value } : f)));
  };

  const deleteField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="relative flex gap-3 items-start bg-[#F4F7FB] p-5 rounded-lg border border-[#E5EAF2]">
            <div className="flex-1">
              {field.type === "notes" && (
                <Textarea
                  placeholder="Additional Notes..."
                  value={field.value}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className="bg-white border-[#E5EAF2]"
                />
              )}
              {field.type === "code" && (
                <Textarea
                  placeholder="Paste code snippet here..."
                  value={field.value}
                  className="font-mono bg-[#1E293B] text-[#E2E8F0] text-sm border-none"
                  onChange={(e) => updateField(field.id, e.target.value)}
                />
              )}
              {field.type === "image" && (
                <div className="space-y-2">
                   <p className="text-xs text-[#64748B] italic mb-2 flex items-center gap-1">
                     <ImageIcon className="w-3 h-3" /> Image attachment notes
                   </p>
                   <Input 
                    type="text" 
                    placeholder="Image Description or temporary URL" 
                    className="bg-white border-[#E5EAF2]"
                    value={field.value}
                    onChange={(e) => updateField(field.id, e.target.value)}
                   />
                </div>
              )}
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={() => deleteField(field.id)}
              className="text-[#94A3B8] hover:text-[#EF4444] hover:bg-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 p-2 bg-white rounded-md border border-dashed border-[#CBD5E1]">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => addField("notes")}
          className="text-[#64748B] hover:text-[#2F6FED]"
        >
          <FileText className="w-4 h-4 mr-2" /> Notes
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => addField("code")}
          className="text-[#64748B] hover:text-[#2F6FED]"
        >
          <Code className="w-4 h-4 mr-2" /> Code
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => addField("image")}
          className="text-[#64748B] hover:text-[#2F6FED]"
        >
          <ImageIcon className="w-4 h-4 mr-2" /> Image Note
        </Button>
      </div>
    </div>
  );
}