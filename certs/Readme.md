# Certificado SSL

## Cloudflare Origin
Caso use a Cloudflare terá que aponta seu dominio para o $IP e ativar o WebProxy. Após isso em "TLS/SSL Secure" > Selecione "Full Strict" e crie um certificado SSL de Origem (CA Cloudflare).
Contexto: User Request Page > Cloudflare DDoS (WAF) > Verifica dominio e IP e o certificado SSL ativo ***DEVE SER*** da Cloudflare.

--------------
## Let's Encrypt
Certificado gerado pela **CERTBOT**.
