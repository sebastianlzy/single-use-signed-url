import React, {useState} from 'react';

import Header from "@cloudscape-design/components/header";
import Container from "@cloudscape-design/components/container";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Input from "@cloudscape-design/components/input";
import Button from "@cloudscape-design/components/button";
import {FormField} from "@cloudscape-design/components";
import axios from 'axios';
import get from "lodash/get"

export default function CreateSignedUrlForm({setGeneratedSignedUrl}) {
    const [filePath, setFilePath] = useState("helloworld.html");
    const [expireInSeconds, setExpireInSeconds] = useState("3600");
    const [isGeneratingSignedUrl, setIsGeneratingSignedUrl] = useState(false);

    const generateSignedUrl = async (e) => {
        e.preventDefault();
        setIsGeneratingSignedUrl(true)
        
        try {
            const endpoint = `${get(process.env, "REACT_APP_HOSTNAME", "")}/create-signed-url?filePath=${filePath}&expiresInSeconds=${expireInSeconds}`
            console.log(endpoint)
            const signedUrl = await axios.get(endpoint)
            setGeneratedSignedUrl(get(signedUrl, "data"))    
        } catch(e){
            console.log(e)
        }

        setIsGeneratingSignedUrl(false)
        
    }
    
    return (
        <Container>
            <SpaceBetween size="s">
                <Header variant="h1">Create Signed URL</Header>

                <FormField
                    description="Enter the file path for S3 object"
                    label="File Path"
                >
                    <Input
                        value={filePath}
                        onChange={(event) => setFilePath(event.detail.value)}
                    />
                </FormField>

                <FormField
                    description="Enter 3600 if the desired expiration time is 1 hour"
                    label="Enter expiration in seconds"
                >
                    <Input
                        value={expireInSeconds}
                        onChange={(event) => setExpireInSeconds(event.detail.value)}
                    />
                </FormField>
                <Button loading={isGeneratingSignedUrl} variant="primary" onClick={generateSignedUrl}>Generate</Button>
            </SpaceBetween>
        </Container>
    );
}
