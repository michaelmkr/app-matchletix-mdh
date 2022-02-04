MathletiX Application
===

###The MatchletiX trainings program should support athletes after a knee injury to pursue their rehabilitation in the late stage by providing an interactive setting. With the objective to reduce the re-injury rate and help them find a safe way back to sport.

### This is a research project of the master Digital Healthcare at the UAS St. Pölten. 

To run the MathletiX application follow these steps:
1. Run this command in your console: `docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET -e DOMAIN_OR_PUBLIC_IP=<YOUR_IP_ADDRESS> -e CERTIFICATE_TYPE=selfsigned openvidu/openvidu-server-kms:2.20.0`
2. Tunnel the application frontend via ngrok (use: `ngrok http 8080 -host-header="localhost:8080"`)
3. Open `https://<YOUR_IP_ADDRESS>:4443/` on your device and accept the certificate
4. Access the application via the https link from ngrok
5. You're good to go

To send the live-feedback messages from [PieSocket](wss://demo.piesocket.com/v3/channel_1?api_key=oCdCMcMPQpbvNjUIzqtvF1d2X2okWpDQj4AwARJuAgtjhzKxVEjQU6IdCjwm&notify_self) use this format:
`{"matchletix":"test"}`


----------------------------------------------------------
Here are some useful copy/paste commands

`docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET -e DOMAIN_OR_PUBLIC_IP=192.168.1.102 -e CERTIFICATE_TYPE=selfsigned openvidu/openvidu-server-kms:2.20.0`

`docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET -e DOMAIN_OR_PUBLIC_IP=192.168.1.102 openvidu/openvidu-server-kms:2.20.0`

`docker run -p 4443:4443 --rm -e OPENVIDU_SECRET=MY_SECRET openvidu/openvidu-server-kms:2.20.0`
