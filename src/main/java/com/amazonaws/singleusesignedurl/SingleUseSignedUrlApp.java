/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package com.amazonaws.singleusesignedurl;

import software.amazon.awscdk.App;
import software.amazon.awscdk.Stack;
import software.amazon.awscdk.StackProps;

import java.io.FileNotFoundException;
import java.util.UUID;

public class SingleUseSignedUrlApp {
    public static void main(final String[] args) throws FileNotFoundException {
        App app = new App();
        
        String stackSecretNameUUId = (String) app.getNode().tryGetContext("stackId");
//        String uuid = UUID.randomUUID().toString().replace("-", "");
//        String eightUUID = uuid.substring(0, Math.min(uuid.length(), 8));
//        new SingleUseSignedUrlStack(app, stackSecretNameId + "-" + eightUUID);
        new SingleUseSignedUrlStack(app, stackSecretNameUUId);


        app.synth();
    }
}
