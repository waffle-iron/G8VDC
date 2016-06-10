# How to integrate the VDC Control Panel into a thirth party website.

Basically they need to implement authentication via Itsyou.online and then integrate the VDC Control Panel as follows:

```html
<iframe id="vdc" src="/whmcs/templates/itsyouonline/vdc_control/index.html?jwt={$jwt}&vdc_id={$vdc_id}"></iframe>
```

- `$jwt` is the json web token taken from itsyou.online. This will make the VDC Control Panel use the authentication from the host site, and provide a seamless authenticated environment for the user.
- `$vdc_id` is the id of the vdc