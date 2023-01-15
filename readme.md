Follow these steps to get your development environment set up<br />
1. Ensure you have Docker, Kubernetes and Skaffold running on your computer<br />
2. Install NGINX ingress controller<br />
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/cloud/deploy.yaml
<br />
3. Open hosts file, add configs:<br />
127.0.0.1 ticketing-server-app.vn<br />
127.0.0.1 ticketing-client-app.vn<br />
4. Navigate to /ticketing folder, run command<br />
skaffold dev
<br />
5. There should have two websites available on your computer:<br />
- https://ticketing-server-app.vn: React server side app, using Next.js<br />
- https://ticketing-client-app.vn: Normal React client side app<br />
