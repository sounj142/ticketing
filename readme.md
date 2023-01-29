I. Follow these steps to get your development environment set up<br />
1. Ensure you have Docker, Kubernetes and Skaffold running on your computer<br />
2. Install NGINX ingress controller<br />
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/cloud/deploy.yaml
<br />
3. Open hosts file, add configs:<br />
127.0.0.1 ticketing-server-app.vn<br />
127.0.0.1 ticketing-client-app.vn<br />
4. Navigate to /ticketing folder, run commands<br />
kubectl create secret generic jwt-secret --from-file=JWT_PRIVATE_KEY=private.key --from-file=JWT_PUBLIC_KEY=public.key
<br />
5. Navigate to /ticketing folder, run command<br />
skaffold dev
<br />
6. There should have two websites available on your computer:<br />
- https://ticketing-server-app.vn: React server side app, using Next.js<br />
- https://ticketing-client-app.vn: Normal React client side app
<br /><br /><br />
II. To publish a new npm version of common library, navigate to /common and run command<br />
npm run pub


<br /><br /><br />
III. To debug, for example, debug tickets microservice:
1. Navigate to /ticketing folder, run command <br/>
skaffold dev
<br/>
2. Run command "kubectl get pods" to get pod names<br/>
3. Find name of ticket-db pod and nats pod. Eg: <br/>
- tickets-db-depl-7b7c758fcb-977hl <br/>
- nats-depl-7c5c544556-qvlmt<br/>
4. Open a new command. The next 2 commands will take control command line, so we need addition one.<br/>
Run commands to open port from kubernetes to local computer<br/>
kubectl port-forward tickets-db-depl-7b7c758fcb-977hl 27017:27017
<br/>
kubectl port-forward nats-depl-7c5c544556-qvlmt 4222:4222
<br/>
5. In Vs Code, navigate to "Run And Debug" (Ctrl+Shift+D), on top left dropdown box, select "Tickets" and click the green triangle button to start debgging.<br/>
In debug mod, navigate to ticket service using url http://localhost:3000
<br/>
All other services still run in kubernetes, use https://ticketing-client-app.vn/ to access them.


<br /><br /><br />
IV. Test
1. To run tests, navigate to service folder, e.g: tickets/<br />
2. Ensure child folder src/__debug should be deleted<br />
3. Run command<br />
npm run test
<br />
