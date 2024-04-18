import CreateSignedUrlForm from "./CreateSignedUrlForm";
import React, {useState} from "react";
import SpaceBetween from "@cloudscape-design/components/space-between";
import GeneratedUrlContainer from "./GeneratedUrlContainer";

export default function SignedURL() {
    const [generatedSignedUrl, setGeneratedSignedUrl] = useState("");
    
    
    return (
        <SpaceBetween size="s">
            <CreateSignedUrlForm setGeneratedSignedUrl={setGeneratedSignedUrl}/>
            {generatedSignedUrl ? <GeneratedUrlContainer generatedSignedUrl={generatedSignedUrl} />: null}
        </SpaceBetween>
    )
}