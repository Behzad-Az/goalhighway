# sudo nano /etc/nginx/sites-enabled/default

#HTTP Server
server {
        listen 80;
        listen [::]:80 default_server ipv6only=on;
        # server_name goalhighway.com;
        # root /home/behzad/app/client/dist;
        # index index.html index.htm;
        # location / {
        #     try_files $uri $uri/ /index.html;
        # }
        # location /api/ {
        #    proxy_pass http://127.0.0.1:19001;
        # }
        # location /imagesapi/ {
        #    proxy_pass http://127.0.0.1:19001;
        # }
        # return 301 https://$host$request_uri;
        return 301 https://goalhighway.com$request_uri;
}

#HTTPS Server
server {
        # Enable HTTP/2
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name goalhighway.com;
        root /home/behzad/app/client/dist;
        index index.html index.htm;

        # User the let's encrypt certificate
        ssl_certificate /etc/letsencrypt/live/goalhighway.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/goalhighway.com/privkey.pem;

        # Include SSL config from cipherli.st
        include snippets/ssl-params.conf;

        location / {
                # root /home/behzad/app/client/dist;
                # index index.html index.htm;
                try_files $uri $uri/ /index.html;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded_For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                # proxy_pass http://127.0.0.1:19001;
                proxy_ssl_session_reuse off;
                proxy_set_header HOST $http_host;
                proxy_cache_bypass $http_upgrade;
                proxy_redirect off;
        }

        location /api/ {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded_For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_pass http://127.0.0.1:19001;
                proxy_ssl_session_reuse off;
                proxy_set_header HOST $http_host;
                proxy_cache_bypass $http_upgrade;
                proxy_redirect off;
        }

        location /imagesapi/ {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded_For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_pass http://127.0.0.1:19001;
                proxy_ssl_session_reuse off;
                proxy_set_header HOST $http_host;
                proxy_cache_bypass $http_upgrade;
                proxy_redirect off;
        }

}
