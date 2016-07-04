## How to Integrate the VDC Control Panel into a Thirth Party Website

The VDC Control Panel requires user authentication via Itsyou.online.

So before you continuing make sure you have Itsyou.online integration working, as documented in the [GitBook for Itsyou.online](https://www.gitbook.com/book/gig/itsyouonline).

With the **autorization code** acquired through the OAuth 2.0 authorization flow you'll be able to get an JSON web token (JWT) needed by the HTML iframe discussed below in order to interact with the virtual datacenter on behalf of the end user.

To learn more about the JSON web token (JWT) support in Itsyou.online, see the [JWT section in the Itsyou.online GitBook](https://gig.gitbooks.io/itsyouonline/content/oauth2/jwt.html).

The actual integration of the VDC Control panel takes three steps:

- **Step 1**: Get the source code onto your web server
- **Step 2**: Embed the VDC Control Panel as a HTML iframe
- **Step 3**: Setup a reverse proxy server


### Step 1: Get the source code onto your web server

The source code for the **VDC Control Panel** is available on GitHub: https://github.com/0-complexity/G8VDC

Copy/clone it into a subdirectory of the web root directory of your web server, which we'll reference here below as `$vdc_control_directory`. 


### Step 2: Embed the VDC Control Panel as a HTML iframe

Here's the iframe to use:

```html
<iframe id="vdc"
        src="/{$vdc_control_directory}/index.html?jwt={$jwt}&vdc_id={$vdc_id}&g8_domain={$g8_domain}">
</iframe>
```
 
This iframe tag takes two attribute values:

- **id**: an identifier for your iframe
- **src**: address/location of the VDC Control Panel source files in your setup + a query string

The query string part of the **src** attribute has three fields:

- **jwt**: the JSON web token, received from (and signed by) ItsYou.online, in order to securily interact with the G8 node on behalf of the end user; discussed above
- **vdc_id**: id of the virtual datacenter as know on the G8 node hosting the virtual datacenter
- **g8_domain**: URL of the G8 node hosting the virtual datacenter


### Step 3: Setup a reverse proxy server

In order to cope with the [same-origin policy](https://en.wikipedia.org/wiki/Same-origin_policy) you will need to set-up a reverse proxy for the **VDC Control Panel** to connect to the G8 node.

Add following lines in between the <virtualhost> tag of the `/etc/apache2/sites-enable/000-default.conf` configuration file:

```html
<VirtualHost *:443>
        SSLProxyEngine On
        RewriteEngine On
        RewriteRule /restmachine/.* - [E=G8_DOMAIN:%{HTTP:X-G8-DOMAIN}]
        ProxyPassInterpolateEnv On
        ProxyPass /restmachine/ https://${G8_DOMAIN}/restmachine/ interpolate
        ProxyPassReverse /restmachine/ https://${G8_DOMAIN}/restmachine/ interpolate
</VirtualHost>
````