# Zoho CRM & Widget Script

## Description

I'm learning Javascript so I made a small Widget to integrate external API with Zoho CRM

## Folder Structure

    ├── app
    │   ├── css
    │   │   └── style.css
    │   ├── js
    │   │   ├── crm_functions.js
    │   │   ├── functions.js
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

##  Register Listeners with EmbededApp
### Subscribe to the EmbeddedApp onPageLoad event before initializing
- [ZOHO.embeddedApp.on("PageLoad")](https://help.zwidgets.com/help/latest/index.html)

### Initializing the widget.
- [ZOHO.embeddedApp.init()](https://help.zwidgets.com/help/latest/index.html)



## Reference
[JS SDK for Zoho CRM](https://help.zwidgets.com/help/latest/index.html)
