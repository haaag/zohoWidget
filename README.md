# Zoho CRM & Widget Script

## Description

`Backend project, obviously not frontend ^_^`

We had the need to show users, who work within the __Potentials__ module, different options to choose from in a dynamic way, no need to force the user to __refresh__ the webpage to see some new data. So, the best way to do this is obtaining the information by using `GET` and `POST` to an external `API` to Zoho. The user can select the data they need, send it to the external API, get the results and send them to Zoho to be processed.

<img align="center" width="930" height="898" src="https://github.com/haaag/zohoWidget/blob/master/img/02-wares-seleccion.png?raw=true">

And we try to imitate the zoho interface so that the user feels more comfortable.
`Sorry mobile users`

## Project Structure

    ├── app
    │   ├── css
    │   │   └── style.css
    │   ├── js
    │   │   ├── utilsCrm.js
    │   │   ├── utils.js
    │   │   ├── main.js
    │   │   ├── crmuser.js
    │   │   └── alerts.js
    │   ├── translations
    │   │   └── en.json
    │   └── widget.html
    ├── dist
    ├── node_modules
    └── server


## Functions I used for this project
## Deluge

[deluge_function](https://help.zwidgets.com/help/latest/ZOHO.CRM.FUNCTIONS.html)

---
## Javascript

##  Register Listeners with EmbededApp
### Subscribe to the EmbeddedApp onPageLoad event before initializing
- [ZOHO.embeddedApp.on("PageLoad")](https://help.zwidgets.com/help/latest/index.html)

Here we get the id of the potential.

### Initializing the widget.
- [ZOHO.embeddedApp.init()](https://help.zwidgets.com/help/latest/index.html)

### Invoke a Function
[ZOHO.CRM.FUNCTIONS.execute](https://help.zwidgets.com/help/latest/ZOHO.CRM.FUNCTIONS.html)

|   Name    |  Type  |  Description  | Mandatory |
|:---------:|:------:|:-------------|:---------:|
| `func_name` | String | Function Name |   `True`    |
| `req_data`  | Object | Request Data  |   `True`    |

Return type: `promise`

---

### Add Notes to a record
[ZOHO.CRM.API.addNotes](https://help.zwidgets.com/help/latest/ZOHO.CRM.API.html#.addNotes)


| Name     | Type   | Description                      | Mandatory |
|:--------:|:------:|:--------------------------------|:---------:|
| `Entity`   | String | SysRefName of the module.        | `True`      |
| `RecordID` | Long   | RecordID to associate the notes. | `True`      |
| `Title`    | String | Notes Title                      | `True`      |
| `Content`  | String | Notes Content                    | `True`      |

Return type: `promise`

---

### Get list of all records in a module
[ZOHO.CRM.API.getAllRecords](https://help.zwidgets.com/help/latest/ZOHO.CRM.API.html#.getAllRecords)

|       Name        |  Type  |                 Description                          | Mandatory |
|:-----------------:|:------:|:----------------------------------------------------|:---------:|
|     `Entity`      | String |                  SysRefName of the module.           |   `True`    |
| `Entitsort_order` | String |    To sort records. allowed values {asc or desc}     |   `False`   |
| `Entitconverted`  | String |         To get the list of converted records         |   `False`   |
|  `Entitapproved`  | String |         To get the list of approved records          |   `False`   |
|    `Entitpage`    | String | To get the list of records from the respective pages |   `False`   |
|  `Entitper_page`  | String |    To get the list of records available per page     |   `False`   |

Return type: `promise`

---


## Reference
[JS SDK from Zoho CRM](https://help.zwidgets.com/help/latest/index.html)

## TODO
- [ ] Add some description to deluge function.
- [ ] Add some dummy example data

