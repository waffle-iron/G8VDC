# How to Integrate the VDC Control Panel into a Thirth Party Website

Basically they need to implement authentication via Itsyou.online and then integrate the VDC Control Panel as follows:

```html
<iframe id="vdc" src="/whmcs/templates/itsyouonline/vdc_control/index.html?jwt={$jwt}&vdc_id={$vdc_id}"></iframe>
```

- `$jwt` is the JSON web token taken from Itsyou.online. This will make the VDC Control Panel use the authentication from the host site, and provide a seamless authenticated environment for the user
- `$vdc_id` is the id of the VDC