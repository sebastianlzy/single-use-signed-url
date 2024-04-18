import {FormField, Link} from "@cloudscape-design/components";
import Container from "@cloudscape-design/components/container";
import React from "react";

export default function GeneratedUrlContainer({generatedSignedUrl}) {
    
    return (
        <Container>
            <FormField label="Generated URL">
                <Link external href={generatedSignedUrl}>{generatedSignedUrl}</Link>
            </FormField>
        </Container>
    )
}