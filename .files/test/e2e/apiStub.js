defineApiStub = function ($httpBackend) {


    $httpBackend.whenGET(/^pages\//).passThrough();

    // Saves items in localStorage, under the given key. This allows us to persist items in the front-end.
    function LocalStorageItem(key) {
        return {
            get: function() {
                var items = localStorage.getItem(key);
                if (items)
                    return JSON.parse(items);
                return undefined;
            },

            getById: function(id) {
                return _.find(this.get(), function(m) { return m.id == id; }); // '==' here is intentional
            },

            getByName: function(machineName) {
                return _.find(this.get(), function(m) { return m.hostname == machineName; });
                console.log(m);
            },

            save: function(item) {
                var items = this.get();
                for (var i = 0; i < items.length; i++) {
                    if (items[i].id == item.id) {
                        items[i] = item;
                    }
                }
                this.set(items);
            },

            saveUser: function(item) {
                var items = this.get();
                for (var i = 0; i < items.length; i++) {
                    console.log(items[i]);
                    if(items[i] != null){
                        if (items[i].username == item.username) {
                            items[i] = item;
                        }
                    }
                }
                this.set(items);
            },

            set: function(items) {
                localStorage.setItem(key, JSON.stringify(items));
            },

            add: function(item) {
                var items = this.get() || [];
                items.push(item);
                this.set(items);
            },

            remove: function(id) {
                var items = this.get();
                var index = -1;
                for (var i = 0; i < items.length; i++) {
                    if (items[i].id == id) {
                        index = i;
                        break;
                    }
                }
                if (index == -1)
                    return;
                items.splice(index, 1);
                this.set(items);
            }
        };
    }

    var UsersList = LocalStorageItem('gcb:users');

    if (!UsersList.get()) {
        UsersList.set([{"username": "admin", "password": "admin"}]);
    }

    $httpBackend.whenPOST('/users/authenticate').
    respond(function (method, url, data) {
        var credentials = angular.fromJson(data);
        var user = _.findWhere(UsersList.get(), credentials);
        if (!user) {
            return [403, 'Unauthorized'];
        }
        return [200, '"yep123456789"'];
    });
    $httpBackend.whenGET(/^\/users\/updatePassword\?.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        var user = _.findWhere(UsersList.get(), {username: params.username});
        if( params.newPassword.length < 8 || params.newPassword.length > 80 || params.newPassword.indexOf(' ') >= 0 || params.newPassword == "undefined" ){
            return [400, "A password must be at least 8 and maximum 80 characters long and may not contain whitespace."]
        }else{
            if (user.password == params.oldPassword){
                    user.password = params.newPassword;
                    UsersList.saveUser(user);
                    return [200, "Congratulations, Your password changed successfully."];
            }else{
                return [203, "Your current password dosen't match."];
            }
        }
    });

    $httpBackend.whenPOST('/users/register').respond(function(method, url, data) {
        var credentials = angular.fromJson(data);
        var users = UsersList.get();
        if (_.findWhere(users, credentials)) {
            return [441, 'This user is already registered'];
        }
        UsersList.add(credentials);
        return [200, "Success"];
    });

    var cloudspaces = [{
        'id': 0,
        'name': 'Main cloudspace',
        'description': 'Description'
    }, {
        'id': 1,
        'name': 'Production cloudspace',
        'description': 'Production Cloudspace'
    }];

    var MachinesList = LocalStorageItem('gcb:machines');
    if (!MachinesList.get()) {
        MachinesList.set([{
            "cloudspaceId":1,
            "status": "RUNNING",
            "hostname": "jenkins.cloudscalers.com",
            "accounts":[{"password":"xGuiyrRp","login":"cloudscalers","guid":""}],
            "description": "JS Webserver",
            "name": "CloudScalers Jenkins",
            "interfaces": [{'ipAddress': '192.168.100.123'}],
            "sizeId": 0,
            "imageId": 0,
            "id": 0,
            "disks": [
              {
              "referenceId": "",
              "diskPath": "",
              "images": [],
              "guid": 53,
              "id": 53,
              "accountId": 7,
              "sizeUsed": 0,
              "descr": "Machine disk of type B",
              "gid": 1,
              "role": "",
              "params": "",
              "type": "B",
              "status": "",
              "stackId": 2,
              "realityDeviceNumber": 0,
              "passwd": "",
              "_meta": [
                "osismodel",
                "cloudbroker",
                "disk",
                1
              ],
              "sizeMax": 10,
              "realityUpdateEpoch": 0,
              "name": "Disk nr -1",
              "acl": {},
              "iqn": "",
              "bootPartition": 0,
              "login": "",
              "order": -1,
              "_ckey": ""
            },
            {
              "referenceId": "/mnt/vmstor/volume/54.raw",
              "diskPath": "",
              "images": [],
              "guid": 54,
              "id": 54,
              "accountId": 7,
              "sizeUsed": 0,
              "descr": "Test data disk",
              "gid": 1,
              "role": "",
              "params": "",
              "type": "D",
              "status": "",
              "realityDeviceNumber": 0,
              "passwd": "",
              "_meta": [
                "osismodel",
                "cloudbroker",
                "disk",
                1
              ],
              "sizeMax": 5,
              "realityUpdateEpoch": 0,
              "name": "disj",
              "acl": {},
              "iqn": "",
              "bootPartition": 0,
              "login": "",
              "order": 0,
              "_ckey": ""
            },
            {
              "referenceId": "/mnt/vmstor/volume/54.raw",
              "diskPath": "",
              "images": [],
              "guid": 54,
              "id": 54,
              "accountId": 7,
              "sizeUsed": 0,
              "descr": "Test Boot disk",
              "gid": 1,
              "role": "",
              "params": "",
              "type": "B",
              "status": "",
              "realityDeviceNumber": 0,
              "passwd": "",
              "_meta": [
                "osismodel",
                "cloudbroker",
                "disk",
                1
              ],
              "sizeMax": 5,
              "realityUpdateEpoch": 0,
              "name": "disj",
              "acl": {},
              "iqn": "",
              "bootPartition": 0,
              "login": "",
              "order": 0,
              "_ckey": ""
            }
          ],
            "acl": [{"guid": "", "right": "ACDRUX", "type": "U", "userGroupId": "user 1"}, {"guid": "", "right": "R", "type": "U", "userGroupId": "user 2"}, {"guid": "", "right": "RCX", "type": "U", "userGroupId": "user 3"}, {"guid": "", "right": "ACDRUX", "type": "U", "userGroupId": "user 4"}]
        }, {
            "cloudspaceId":1,
            "status": "HALTED",
            "hostname": "cloudbroker.cloudscalers.com",
            "accounts":[{"password":"nGGuqMKJrRp","login":"cloudscalers","guid":""}],
            "description": "CloudScalers CloudBroker",
            "name": "CloudBroker",
            "interfaces": [{'ipAddress': '192.168.100.66'}],
            "sizeId": 0,
            "imageId": 1,
            "id": 1,
            "disks": [
              {
              "referenceId": "",
              "diskPath": "",
              "images": [],
              "guid": 53,
              "id": 53,
              "accountId": 7,
              "sizeUsed": 0,
              "descr": "Machine disk of type B",
              "gid": 1,
              "role": "",
              "params": "",
              "type": "B",
              "status": "",
              "stackId": 2,
              "realityDeviceNumber": 0,
              "passwd": "",
              "_meta": [
                "osismodel",
                "cloudbroker",
                "disk",
                1
              ],
              "sizeMax": 10,
              "realityUpdateEpoch": 0,
              "name": "Disk nr -1",
              "acl": {},
              "iqn": "",
              "bootPartition": 0,
              "login": "",
              "order": -1,
              "_ckey": ""
            },
            {
              "referenceId": "/mnt/vmstor/volume/54.raw",
              "diskPath": "",
              "images": [],
              "guid": 54,
              "id": 54,
              "accountId": 7,
              "sizeUsed": 0,
              "descr": "Test data disk",
              "gid": 1,
              "role": "",
              "params": "",
              "type": "D",
              "status": "",
              "realityDeviceNumber": 0,
              "passwd": "",
              "_meta": [
                "osismodel",
                "cloudbroker",
                "disk",
                1
              ],
              "sizeMax": 5,
              "realityUpdateEpoch": 0,
              "name": "disj",
              "acl": {},
              "iqn": "",
              "bootPartition": 0,
              "login": "",
              "order": 0,
              "_ckey": ""
            },
            {
              "referenceId": "/mnt/vmstor/volume/54.raw",
              "diskPath": "",
              "images": [],
              "guid": 54,
              "id": 54,
              "accountId": 7,
              "sizeUsed": 0,
              "descr": "Test Boot disk",
              "gid": 1,
              "role": "",
              "params": "",
              "type": "B",
              "status": "",
              "realityDeviceNumber": 0,
              "passwd": "",
              "_meta": [
                "osismodel",
                "cloudbroker",
                "disk",
                1
              ],
              "sizeMax": 5,
              "realityUpdateEpoch": 0,
              "name": "disj",
              "acl": {},
              "iqn": "",
              "bootPartition": 0,
              "login": "",
              "order": 0,
              "_ckey": ""
            }
          ],
            "acl": [{"guid": "", "right": "ACDRUX", "type": "U", "userGroupId": "user 1"}]
        }]);
    }

    var images = [
        {
            "name": "Windows 2008 Server",
            "UNCPath": "",
            "description": "",
            "type": "Windows",
            "id": 0,
            "size": 65
        },
        {
            "name": "Linux 13.04 image",
            "UNCPath": "",
            "description": "",
            "type": "Ubuntu",
            "id": 1,
            "size": 100
        },
        {
            "name": "first template",
            "UNCPath": "",
            "description": "description for first template",
            "type": "Custom Templates",
            "id": 2,
            "size": 150
        },
        {
            "name": "ssssss template",
            "UNCPath": "",
            "description": "",
            "type": "Custom Templates",
            "id": 3,
            "size": 200
        }
    ];

    var sizes = [
        {
        "vcpus": 4,
        "description": "10GB at SSD Speed, Unlimited Transfer - 70 USD/month",
        "id": 4,
        "name": "",
        "memory": 8192,
        "disks": [10, 20, 30, 280]
        },
        {
        "vcpus": 8,
        "description": "10GB at SSD Speed, Unlimited Transfer - 140 USD/month",
        "id": 5,
        "name": "",
        "memory": 16384,
        "disks": [40, 50, 60]
        },
        {
        "vcpus": 1,
        "description": "10GB at SSD Speed, Unlimited Transfer - 7.5 USD/month",
        "id": 1,
        "name": "",
        "memory": 512,
        "disks": [80, 90, 70]
        },
        {
        "vcpus": 12,
        "description": "10GB at SSD Speed, Unlimited Transfer - 250 USD/month",
        "id": 6,
        "name": "",
        "memory": 32768,
        "disks": [100, 110, 120]
        },
        {
        "vcpus": 1,
        "description": "10GB at SSD Speed, Unlimited Transfer - 15 USD/month",
        "id": 2,
        "name": "",
        "memory": 1024,
        "disks": [150, 130, 140]
        },
        {
        "vcpus": 16,
        "description": "10GB at SSD Speed, Unlimited Transfer - 350 USD/month",
        "id": 7,
        "name": "",
        "memory": 49152,
        "disks": [160, 170, 180]
        },
        {
        "vcpus": 2,
        "description": "10GB at SSD Speed, Unlimited Transfer - 18 USD/month",
        "id": 3,
        "name": "",
        "memory": 2048,
        "disks": [190, 200, 210]
        },
        {
        "vcpus": 20,
        "description": "10GB at SSD Speed, Unlimited Transfer - 465 USD/month",
        "id": 8,
        "name": "",
        "memory": 65536,
        "disks": [220, 230, 240]
        },
        {
        "vcpus": 2,
        "description": "10GB at SSD Speed, Unlimited Transfer - 36 USD/month",
        "id": 10,
        "name": "",
        "memory": 4096,
        "disks": [250, 260, 270]
        }
    ];

    var actionlist = {
        'stop': 'HALTED',
        'start': 'RUNNING'
    };


    $httpBackend.whenGET(/^\/machines\/get\?machineId=(.+).*/).respond(function (method, url, data) {
         var params = new URI(url).search(true);
        if (!_.find(MachinesList.get(), function(m) { return m.id == params.machineId; })) {
            return [500, 'Not found']
        }
        var matchedMachine = MachinesList.getById(params.machineId);
        var osImage = _.where(images, {id: matchedMachine.imageId});
        matchedMachine.osImage = osImage[0].name;
        return [200, matchedMachine];
    });

    $httpBackend.whenGET(/^\/machines\/list\?cloudspaceId=(\d+).*/).respond(function (method, url, data) {
        var params = new URI(url).search(true);
        var cloudspaceId = params.cloudspaceId;
        return [200, _.values(_.filter(MachinesList.get(), function(machine){
            return machine.cloudspaceId == cloudspaceId;
        }))];
    });
    $httpBackend.whenGET(/^\/images\/list\b.*/).respond(images);
    $httpBackend.whenGET(/^\/sizes\/list\b.*/).respond(sizes);
    $httpBackend.whenGET(/^\/machines\/create\?.*/).respond(function (method, url, data) {
        var params = new URI(url).search(true);
        if(MachinesList.getByName(params.name) == undefined){
            var id = Math.random();
            var machine = {
                status: "RUNNING",
                cloudspaceId: parseInt(params.cloudspaceId),
                hostname: params.name,
                description: params.description,
                name: params.name,
                accounts:[{password:"xGiooOyrRp",login:"cloudscalers",guid:""}],
                interfaces: [{'ipAddress':'192.168.100.34'}],
                sizeId: parseInt(params.sizeId),
                imageId: parseInt(params.imageId),
                disksize: parseInt(params.disksize),
                archive: params.archive,
                region: params.region,
                replication: params.replication,
                id: id
            };
                MachinesList.add(machine);
                return [200, id];
        }
        else{
            return [409, 'Machine name duplicated!']
        }
    });

    $httpBackend.whenGET(/^\/machines\/update\?.*/).respond(function (method, url, data) {
        var params = new URI(url).search(true);
        var machine = MachinesList.getById(params.machineId);
        machine.description = params.description;
        MachinesList.save(machine);
        return [200, true];
    });

    $httpBackend.whenGET(/^\/machines\/action\?.*/).respond(function (method, url, data) {
        var params = new URI(url).search(true);
        var action = params.action;
        var machineid = params.machineId;
        if (!_.has(actionlist, action)) {
            return [500, 'Invallid action'];
        }
        var machine = MachinesList.getById(machineid);
        machine.status = actionlist[action];
        MachinesList.save(machine);
        return [200, true];
    });

    $httpBackend.whenGET(/^\/machines\/delete\?.*/).respond(function (method, url, data) {
        var params = new URI(url).search(true);
        var machineid = params.machineId;
        console.log('Stub Delete ' + machineid);
        var machines = MachinesList.get();
        if (!_.find(machines, function(m) { return m.id == machineid; })) {
            return [500, 'Machine not found'];
        }
        MachinesList.remove(machineid);
        return [200, true];
    });

    // Snapshots
    var snapshots = [
        "snap1",
        "snap2",
        "snap3",
        "snap4"
    ];

    $httpBackend.whenGET(/\/machines\/listSnapshots\?.*/).respond(snapshots);

    $httpBackend.whenGET(new RegExp('/machines/snapshot\\?machineId=2&name=.*?(&api_key=.*?)')).respond(function(status, data) {
        return [500, "Can't create snapshot"];
    });
    $httpBackend.whenGET(/\/machines\/snapshot\?.*/).respond(function(status, data) {
        var params = new URI(url).search(true);
        var name = params.name;
        snapshots.push(name);
        return [200, name];
    });



    // getConsoleUrl
    $httpBackend.whenGET(/^\/machines\/getConsoleUrl\?machineId=(\d+).*/).respond('null');


    // actions
    $httpBackend.whenGET(/^\/machines\/start\?machineId=\d+.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        var machineid = params.machineId;
        var machines = MachinesList.get();
        if (!_.find(machines, function(m) { return m.id == machineid; })) {
            return [500, 'Machine not found'];
        }
        var machine = MachinesList.getById(machineid);
        machine.status = 'RUNNING';
        MachinesList.save(machine);
        return [200, 'RUNNING'];
    });

    $httpBackend.whenGET(/^\/machines\/stop\?machineId=\d+.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        var machineid = params.machineId;
        var machines = MachinesList.get();
        if (!_.find(machines, function(m) { return m.id == machineid; })) {
            return [500, 'Machine not found'];
        }
        var machine = MachinesList.getById(machineid);
        machine.status = 'HALTED';
        MachinesList.save(machine);
        return [200, 'HALTED'];
    });

    $httpBackend.whenGET(/^\/machines\/reboot\?machineId=\d+.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        var machineid = params.machineId;
        var machines = MachinesList.get();
        if (!_.find(machines, function(m) { return m.id == machineid; })) {
            return [500, 'Machine not found'];
        }
        var machine = MachinesList.getById(machineid);
        machine.status = 'RUNNING';
        MachinesList.save(machine);
        return [200, 'RUNNING'];
    });

    $httpBackend.whenGET(/^\/machines\/pause\?machineId=\d+.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        var machineid = params.machineId;
        var machines = MachinesList.get();
        if (!_.find(machines, function(m) { return m.id == machineid; })) {
            return [500, 'Machine not found'];
        }
        var machine = MachinesList.getById(machineid);
        machine.status = 'PAUSED';
        MachinesList.save(machine);
        return [200, 'PAUSED'];
    });

    $httpBackend.whenGET(/^\/machines\/resume\?machineId=\d+.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        var machineid = params.machineId;
        var machines = MachinesList.get();
        if (!_.find(machines, function(m) { return m.id == machineid; })) {
            return [500, 'Machine not found'];
        }
        var machine = MachinesList.getById(machineid);
        machine.status = 'RUNNING';
        MachinesList.save(machine);
        return [200, 'RUNNING'];
    });

    $httpBackend.whenGET(/^\/machines\/rename\?machineId=.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        var machineid = params.machineId;
        var newName = params.newName;
        var machines = MachinesList.get();
        if (!_.find(machines, function(m) { return m.id == machineid; })) {
            return [500, 'Machine not found'];
        }
        var machine = MachinesList.getById(machineid);
        machine.name = newName;
        MachinesList.save(machine);
        return [200, 'OK'];
    });

    // clone
    $httpBackend.whenGET(/^\/machines\/clone\?machineId=\d+.*/).respond('OK');

    $httpBackend.whenGET(/^\/accounts\/list.*/).respond([
        {id: '1', name: 'Lenny Miller', preferredDataLocation: "us1"},
        {id: '2', name: 'Awingu', preferredDataLocation: "ca1"},
        {id: '4', name: 'Incubaid', preferredDataLocation: "us1"},
    ]);

    var cloudspaces = [
       {id: '1', name: 'Default', accountId: '1', publicipaddress: '173.194.39.40', location: "ca1", acl:[{"guid":"","right":"ACDRUX","type":"U","userGroupId":"Lenny Miller","canBeDeleted": false},{"guid":"","right":"ACDRUX","type":"U","userGroupId":"karim","canBeDeleted": false},{"guid":"","right":"RCX","type":"U","userGroupId":"user 3", "canBeDeleted": true},{"guid":"","right":"ACDRUX","type":"U","userGroupId":"user 4", "canBeDeleted": true}], status: "DEPLOYED", userRightsOnCloudspace: { guid: "", right: "ACDRUX", type: "U", userGroupId: "Lenny Miller"} ,userRightsOnCloudspaceBilling: true, accountName: "Lenny Miller"} ,
       {id: '2', name: 'Development', accountId: '2', publicipaddress: '173.194.39.40', location: "us1", acl:{guid: "", right: "ACDRUX", type: "U", userGroupId: "Awingu"}, status: "DEPLOYED", userRightsOnCloudspace: { guid: "", right: "ACDRUX", type: "U", userGroupId: "Awingu"} ,userRightsOnAccountBilling: true, accountName: "Awingu"},
       {id: '3', name: 'Training', accountId: '2', publicipaddress: '173.194.39.40', location: "ca1", acl:{guid: "", right: "ACDRUX", type: "U", userGroupId: "Awingu"}, status: "CREATED", userRightsOnCloudspace: { guid: "", right: "ACDRUX", type: "U", userGroupId: "Awingu"} ,userRightsOnAccountBilling: true, accountName: "Awingu"},
       {id: '4', name: 'Production', accountId: '2', publicipaddress: '173.194.39.40', location: "us1", acl:{guid: "", right: "ACDRUX", type: "U", userGroupId: "Awingu"}, status: "CREATED", userRightsOnCloudspace: { guid: "", right: "ACDRUX", type: "U", userGroupId: "Awingu"} ,userRightsOnAccountBilling: true, accountName: "Awingu"},
       {id: '5', name: 'Development', accountId: '4', publicipaddress: '173.194.39.40', location: "ca1", acl:{guid: "", right: "ACDRUX", type: "U", userGroupId: "Incubaid"}, status: "CREATED", userRightsOnCloudspace: { guid: "", right: "ACDRUX", type: "U", userGroupId: "Incubaid"} ,userRightsOnAccountBilling: true, accountName: "Incubaid"},
       {id: '6', name: 'Acceptance', accountId: '4', publicipaddress: '173.194.39.40', location: "ca1", acl:{guid: "", right: "ACDRUX", type: "U", userGroupId: "Incubaid"}, status: "CREATED", userRightsOnCloudspace: { guid: "", right: "ACDRUX", type: "U", userGroupId: "Incubaid"} ,userRightsOnAccountBilling: true, accountName: "Incubaid"},
       {id: '7', name: 'Production', accountId: '4', publicipaddress: '173.194.39.40', location: "us1", acl:{guid: "", right: "ACDRUX", type: "U", userGroupId: "Incubaid"}, status: "CREATED", userRightsOnCloudspace: { guid: "", right: "ACDRUX", type: "U", userGroupId: "Incubaid"} ,userRightsOnAccountBilling: true, accountName: "Incubaid"},
    ];



    var cloudSpace = {
        name: 'Development',
        descr: 'Development machine',
        acl: [
            {
                "guid":"",
                "right":"ACDRUX",
                "type":"U",
                "userGroupId":"Lenny Miller",
                "canBeDeleted": false
            },
            {
                "guid":"",
                "right":"ACDRUX",
                "type":"U",
                "userGroupId":"karim",
                "canBeDeleted": false
            },
            {
                "type": "U",
                "guid": "",
                "right": "ACDRUX",
                "userGroupId": "user 1",
                "canBeDeleted": true
            }, {
                "type": "U",
                "guid": "",
                "right": "ACDRUX",
                "userGroupId": "user 2",
                "canBeDeleted": true
            },
            {
                "guid":"",
                "right":"RCX",
                "type":"U",
                "userGroupId":"user 3",
                "canBeDeleted": true
            },
            {
                "guid":"",
                "right":"ACDRUX",
                "type":"U",
                "userGroupId":"user 4",
                "canBeDeleted": true
            }]
    };

    $httpBackend.whenGET(/^\/cloudspaces\/list.*/).respond(cloudspaces);
    $httpBackend.whenGET(/^\/cloudspaces\/get\?.*/).respond(cloudSpace);

    $httpBackend.whenGET(/^\/cloudspaces\/addUser\?.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        cloudSpace.acl.push({ guid: '', right: params.accesstype, type: 'U' , userGroupId: params.userId });
        return [200, 'Success'];
    });

    $httpBackend.whenGET(/^\/cloudspaces\/deleteUser\?.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        var userId = params.userId;
        cloudSpace.acl = _.reject(cloudSpace.acl, function(acl) { return acl.userGroupId == userId});
        return [200, 'Success'];
    });

    $httpBackend.whenGET(/^\/cloudspaces\/create.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        if (_.findWhere(cloudspaces, {name: params.name}))
            return [500, 'Cloudspace already exists'];

        cloudspaces.push({
            id: '15',
            name: params.name,
            accountId: params.accountId,
            acl: [
                {
                    "type": "U",
                    "guid": "",
                    "right": "ACDRUX",
                    "userGroupId": "linny"
                }, {
                    "type": "U",
                    "guid": "",
                    "right": "ACDRUX",
                    "userGroupId": "harvey"
                }
            ],
        });
        return [200, '15']; // ID = 15
    });

    $httpBackend.whenGET(/^\/cloudspaces\/delete\?.*/).respond(function (method, url, data) {
        var params = new URI(url).search(true);
        var cloudSpaceItem = _.where(cloudspaces, {id: params.cloudspaceId});
        if(cloudSpaceItem.length > 0){
            cloudspaces.splice(_.where(cloudspaces, {id: params.cloudspaceId}), 1);
            return [200, true];
        }else{
            return [500, "Cloudspace couldn't found!"];
        }
    });

    var account = {
        name: 'Linny Miller',
        descr: 'Mr. Linny Miller',
        preferredLocation: "us1",
        acl: [{
                "type": "U",
                "guid": "",
                "right": "ACDRUX",
                "userGroupId": "linny"
            }, {
                "type": "U",
                "guid": "",
                "right": "ACDRUX",
                "userGroupId": "harvey"
            }
        ]
    };
    $httpBackend.whenGET(/^\/accounts\/get\?.*/).respond(account);


    $httpBackend.whenGET(/^\/accounts\/addUser\?.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        var userId = params.userId.toLowerCase();
        if (userId.indexOf('user') >= 0) {
            account.acl.push({ type: 'U', guid: '', right: 'ACDRUX', userGroupId: userId});
            return [200, "Success"];
        } else if (userId.indexOf('not found') >= 0) {
            return [404, 'User not found'];
        } else if (userId.indexOf('eee') >= 0) {
            return [3000, 'Unspecified error'];
        } else {
            return [500, 'Server error'];
        }
    });
    $httpBackend.whenGET(/^\/accounts\/deleteUser\?.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        var userId = params.userId;
        account.acl = _.reject(account.acl, function(acl) { return acl.userGroupId == userId});
        return [200, 'Success'];
    });


    $httpBackend.whenGET(/^\/machines\/getHistory\?.*/).respond([
        {
            _source: {
                message: "stop",
                epoch: 1389016668
            }
        },
        {
            _source: {
                message: "start",
                epoch: 1389015668
            }
        },
    ]);

    $httpBackend.whenGET(/^\/users\/get\?.*/).respond({
        username: 'admin',
        emailaddresses: [ 'admin@codescalers.com' ],
        data: {'tourtips': 'false'}
    });

    $httpBackend.whenGET(/^\/accounts\/getCreditBalance.*/).respond("20");

    $httpBackend.whenGET(/^\/accounts\/getCreditHistory.*/).respond([
       {
            status: "PROCESSED",
            currency: "LTC",
            amount: 0.43383948,
            reference: "e50d4d6866279ebc18bbe2ef84d187b050b9ed998340c1ef5f74b2d565c7d550",
            time: 1391516164,
            credit: 10.000000014000001,
            comment: "Credit",
            accountid: "fe8409b1-fa21-4fc1-b2d3-c752928c450c"
        },
        {
            status: "PROCESSED",
            currency: "LTC",
            amount: 0.43383948,
            reference: "a33f6a65550a7512c0c56c55a0057023a9a987233bd4eb692a9c1c2e788957dd",
            time: 1391432480,
            credit: 10.000000014000001,
            comment: "Credit",
            accountid: "fe8409b1-fa21-4fc1-b2d3-c752928c450c"
        },
        {
            status: "DEBIT",
            currency: "LTC",
            amount: 0.43383948,
            reference: "a33f6a65550a7512c0c56c55a0057023a9a987233bd4eb692a9c1c2e788957dd",
            time: 1391432480,
            credit: 10.000000014000001,
            comment: "Credit",
            accountid: "fe8409b1-fa21-4fc1-b2d3-c752928c450c"
        }
    ]);

    $httpBackend.whenGET(/^\/payments\/getPaymentInfo.*/).respond(function(method,url,data)
    {
        var params = new URI(url).search(true);
        var coin = params.coin;
        if (coin == 'BTC') {
            return [200,{coin: "BTC", value: 800.05, address: "1BBnbfhkkVVAan61362PkhGMdjXk5YsrmP"}];
        } else if (coin == 'LTC') {
            return [200,{coin: "LTC", value: 23.05, address: "LZLRqxWip27u5pGzc1amMhcaH16VRMSaYt"}];
        } else  {
            return [504, 'Bad request'];
        }

    });

    var storages = [
       {url: "https://mybucketname.uss3.vscalers.com", accesskey:"ALSECKCKDKMKC5GUSNFA", secretkey:'DEFEDD', size: 1984995885, cloudspaceId: 1},
       {url: "https://mybucketname.uss3.vscalers.com", accesskey:"bbbbbbbbbbbbbbbbbbbb", secretkey:'fadfdf', size: 2984995885, cloudspaceId: 1},
    ];
    $httpBackend.whenGET(/^\/storagebuckets\/list\?cloudspaceId=\d+.*/).respond(storages);

    var portforwarding = [
       {id: 0, publicIp: '125.85.7.1', vmName: "CloudScalers Jenkins" , machineId: 0 , publicPort: 8080, localPort: 80, cloudspaceId: 0, protocol: 'tcp'},
       {id: 1, publicIp: '125.85.7.1', vmName: "CloudScalers Jenkins" , machineId: 0, publicPort: 2020, localPort: 20, cloudspaceId: 0, protocol: 'udp'},
       {id: 2, publicIp: '125.85.7.1', vmName: "CloudScalers Jenkins" , machineId: 0, publicPort: 7070, localPort: 70, cloudspaceId: 0, protocol: 'tcp'},
       {id: 3, publicIp: '125.85.7.1', vmName: "CloudBroker" , machineId: 1, publicPort: 9090, localPort: 90, cloudspaceId: 0, protocol: 'tcp'},
       {id: 4, publicIp: '125.85.7.1', vmName: "CloudBroker" , machineId: 1, publicPort: 3030, localPort: 30, cloudspaceId: 1, protocol: 'tcp'},
       {id: 5, publicIp: '125.85.7.1', vmName: "CloudBroker" , machineId: 1, publicPort: 8080, localPort: 80, cloudspaceId: 1, protocol: 'tcp'},
       {id: 6, publicIp: '126.84.3.9', vmName: "CloudScalers Jenkins" , machineId: 0, publicPort: 2020, localPort: 20, cloudspaceId: 1, protocol: 'tcp'},
       {id: 7, publicIp: '126.84.3.9', vmName: "CloudScalers Jenkins" , machineId: 0, publicPort: 4040, localPort: 40, cloudspaceId: 1, protocol: 'tcp'},
       {id: 8, publicIp: '126.84.3.9', vmName: "CloudScalers Jenkins" , machineId: 0, publicPort: 6060, localPort: 60, cloudspaceId: 1, protocol: 'tcp'},
       {id: 9, publicIp: '126.84.3.9', vmName: "CloudBroker" , machineId: 1, publicPort: 1010, localPort: 10, cloudspaceId: 1, protocol: 'tcp'},
       {id: 10, publicIp: '126.84.3.9', vmName: "CloudBroker" , machineId: 1, publicPort: 3030, localPort: 30, cloudspaceId: 1, protocol: 'tcp'},
       {id: 11, publicIp: '126.84.3.9', vmName: "CloudBroker" , machineId: 1, publicPort: 5050, localPort: 50, cloudspaceId: 1, protocol: 'tcp'},
    ];

    var portforwardingList = LocalStorageItem('gcb:portforwarding');
    if(!portforwardingList.get('gcb:portforwarding')){
        portforwardingList.set(portforwarding);
    }
    var portforwardingListResult = portforwardingList.get('gcb:portforwarding');

    $httpBackend.whenGET(/^\/portforwarding\/list.*cloudspaceId.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        var portforwardsList = portforwardingList.get('gcb:portforwarding');
        if(params.id == undefined){
            if(params.machineId){
                return[200, _.where(portforwardsList, {machineId: parseInt(params.machineId), cloudspaceId: parseInt(params.cloudspaceId) })];
            }else{
                return[200, _.where(portforwardsList, { cloudspaceId: parseInt(params.cloudspaceId) })];
            }
        }else{
            var filteredPorts = _.where(portforwardsList, {id: parseInt(params.id)});
            return[200, filteredPorts];
        }
    });

    $httpBackend.whenGET(/^\/portforwarding\/list\?id=\d+.*/).respond(storages);


    $httpBackend.whenGET(/^\/portforwarding\/create.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        var id = portforwardingListResult.length + 1;
        portforwardingList.add({
            id: id,
            cloudspaceId: parseInt(params.cloudspaceId),
            localPort: parseInt(params.localPort),
            publicIp: params.publicIp,
            publicPort: parseInt(params.publicPort),
            machineId: parseInt(params.machineId),
            vmName: MachinesList.getById(params.machineId).name,
            protocol: params.protocol
        });
        return [200, params.ip];
    });

    $httpBackend.whenGET(/^\/portforwarding\/list.*authkey.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        if(params.id == undefined){
            return [200, portforwardingListResult];
        }else{
            var filteredPorts = _.where(portforwardingListResult, {id: parseInt(params.id)});
            return[200, filteredPorts];
        }
    });


    var usageReport = [
        {"totalCost":82719671.0,"untilTime":1398902400,"fromTime":1396310400,"_meta":["osismodel","billing","billingstatement",1],"lastupdatedTime":0,"cloudspaces":[{"totalCost":82719671.0,"cloudspaceId":1,"_meta":["osismodel","billing","cloudspaceusage",1],"guid":"","id":1,"machines":[{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"qwer","machineId":2,"sizeId":0,"hostName":"","creationTime":1394633526,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":1,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"polle","machineId":6,"sizeId":0,"hostName":"","creationTime":1394635758,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":2,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"qwertyuio","machineId":12,"sizeId":0,"hostName":"","creationTime":1394637633,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":3,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"qwertyui","machineId":19,"sizeId":0,"hostName":"","creationTime":1395064418,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":4,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"qwertysdfghjkmnmnmnmnmnmn","machineId":25,"sizeId":0,"hostName":"","creationTime":1395137411,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":5,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"enableagain3","machineId":36,"sizeId":0,"hostName":"","creationTime":1396352244,"cpus":0,"imageId":0,"cost":2550156.0,"networkGatewayIPv4":"","guid":"","id":6,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"testbeforedisable1","machineId":31,"sizeId":0,"hostName":"","creationTime":1396345372,"cpus":0,"imageId":0,"cost":2557028.0,"networkGatewayIPv4":"","guid":"","id":7,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"poikl","machineId":8,"sizeId":0,"hostName":"","creationTime":1394636069,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":8,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"asdfgvbhnjkpoiuytre","machineId":21,"sizeId":0,"hostName":"","creationTime":1395072740,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":9,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"qwertyu","machineId":23,"sizeId":0,"hostName":"","creationTime":1395134529,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":10,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"enableagain2","machineId":35,"sizeId":0,"hostName":"","creationTime":1396351690,"cpus":0,"imageId":0,"cost":2550710.0,"networkGatewayIPv4":"","guid":"","id":11,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"adsf","machineId":4,"sizeId":0,"hostName":"","creationTime":1394634750,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":12,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"mnnsdfgsdfg","machineId":14,"sizeId":0,"hostName":"","creationTime":1394695096,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":13,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"asdasd","machineId":17,"sizeId":0,"hostName":"","creationTime":1395047689,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":14,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"qwefvbcxzasd","machineId":16,"sizeId":0,"hostName":"","creationTime":1394696141,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":15,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"sdjhgfjhgfjhgf","machineId":22,"sizeId":0,"hostName":"","creationTime":1395073761,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":16,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"testafterdisable","machineId":32,"sizeId":0,"hostName":"","creationTime":1396345476,"cpus":0,"imageId":0,"cost":2556924.0,"networkGatewayIPv4":"","guid":"","id":17,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"trew","machineId":3,"sizeId":0,"hostName":"","creationTime":1394634332,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":18,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"asdfqwer","machineId":5,"sizeId":0,"hostName":"","creationTime":1394634990,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":19,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"iuykj","machineId":10,"sizeId":0,"hostName":"","creationTime":1394637466,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":20,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"qwefvbcxz","machineId":15,"sizeId":0,"hostName":"","creationTime":1394696064,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":21,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"testhendriki","machineId":18,"sizeId":0,"hostName":"","creationTime":1395048010,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":22,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"karim-test","machineId":20,"sizeId":0,"hostName":"","creationTime":1395064988,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":23,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"qwerty","machineId":24,"sizeId":0,"hostName":"","creationTime":1395135590,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":24,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"afterdisable","machineId":33,"sizeId":0,"hostName":"","creationTime":1396345958,"cpus":0,"imageId":0,"cost":2556442.0,"networkGatewayIPv4":"","guid":"","id":25,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"adf","machineId":1,"sizeId":0,"hostName":"","creationTime":1394633125,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":26,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"zxcvb","machineId":7,"sizeId":0,"hostName":"","creationTime":1394635902,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":27,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"hgjjhgghj","machineId":9,"sizeId":0,"hostName":"","creationTime":1394637348,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":28,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"asdfadsf","machineId":11,"sizeId":0,"hostName":"","creationTime":1394637539,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":29,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"polkmnhg","machineId":13,"sizeId":0,"hostName":"","creationTime":1394638208,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":30,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"sadflaksdfmsdf","machineId":26,"sizeId":0,"hostName":"","creationTime":1395150376,"cpus":0,"imageId":0,"cost":2592000.0,"networkGatewayIPv4":"","guid":"","id":31,"deletionTime":0},{"status":"","cloudspaceId":0,"disks":[],"_meta":["osismodel","billing","vmachine",1],"name":"enableagain","machineId":34,"sizeId":0,"hostName":"","creationTime":1396345989,"cpus":0,"imageId":0,"cost":2556411.0,"networkGatewayIPv4":"","guid":"","id":32,"deletionTime":0}],"name":"default"}],"guid":2,"id":2,"_ckey":"","accountId":1}
    ]
    $httpBackend.whenGET(/^\/consumption\/get.*/).respond(usageReport);

    $httpBackend.whenGET(/^\/portforwarding\/update.*/).respond(function(method, url, data) {
            var params = new URI(url).search(true);
            var portforward = portforwardingList.getById(params.id);
            portforward.cloudspaceId = parseInt(params.cloudspaceId);
            portforward.localPort = parseInt(params.localPort);
            portforward.protocol = params.protocol;
            portforward.publicIp = params.publicIp;
            portforward.publicPort = parseInt(params.publicPort);
            portforward.vmName = MachinesList.getById(params.machineId).name;
            portforward.machineId = parseInt(params.machineId);
            portforwardingList.save(portforward);
            return [200, portforwardingListResult];
        });

    $httpBackend.whenGET(/^\/portforwarding\/delete.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        portforwardingList.remove(parseInt(params.id));
        return [200, portforwardingListResult];
    });

    $httpBackend.whenGET(/^\/template\/delete\?.*/).respond(function (method, url, data) {
        var params = new URI(url).search(true);
        var imageTemplate = _.where(images, {type: "Custom Templates"});
        if(imageTemplate.length > 0){
            imageTemplate.splice( params.templateIndex , 1);
            return [200, true];
        }else{
            return [500, "Templates couldn't found!"];
        }
    });
    $httpBackend.whenGET('/locations/list').respond(
        [{'_ckey': '',
        '_meta': ['osismodel', 'cloudbroker', 'location', 1],
        'flag': 'uk',
        'gid': 500,
        'guid': 1,
        'id': 1,
        'locationCode': 'eu1',
        'name': 'UK'},
        {'_ckey': '',
        '_meta': ['osismodel', 'cloudbroker', 'location', 1],
        'flag': 'belgium',
        'gid': 600,
        'guid': 2,
        'id': 2,
        'locationCode': 'eu2',
        'name': 'Belgium'},
        {'_ckey': '',
        '_meta': ['osismodel', 'cloudbroker', 'location', 1],
        'flag': 'canada',
        'gid': 600,
        'guid': 2,
        'id': 2,
        'locationCode': 'ca1',
        'name': 'Canada'}]
        );

    $httpBackend.whenGET(/^\/machines\/addUser.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        var machine = _.find(MachinesList.get(), function(m) { return m.id == params.machineId; });
        machine.acl.push({ type: 'U', guid: '', right: params.accesstype , userGroupId: params.userId });
        MachinesList.save(machine);

        return [200, '15'];
    });

    $httpBackend.whenGET(/^\/machines\/deleteUser.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        var machine = _.find(MachinesList.get(), function(m) { return m.id == params.machineId; });
        var userAcl = _.find(machine.acl , function(acl) { return acl.userGroupId == params.userId; });
        machine.acl.splice(machine.acl.indexOf(userAcl), 1);
        MachinesList.save(machine);

        return [200, '15'];
    });

    $httpBackend.whenGET(/^\/machines\/updateUser.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        var machine = _.find(MachinesList.get(), function(m) { return m.id == params.machineId; });
        var userAcl = _.find(machine.acl , function(acl) { return acl.userGroupId == params.userId; });
        machine.acl[machine.acl.indexOf(userAcl)].right = params.accesstype;
        MachinesList.save(machine);
        return [200, '15'];
    });

    $httpBackend.whenGET(/^\/cloudspaces\/updateUser.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        var cloudSpace = _.find(cloudspaces, function(m) { return m.id == params.cloudspaceId; });
        var userAcl = _.find(cloudSpace.acl , function(acl) { return acl.userGroupId == params.userId; });
        cloudSpace.acl[cloudSpace.acl.indexOf(userAcl) ].right = params.accesstype;
        return [200, '15'];
    });

    $httpBackend.whenGET(/^\/machines\/addDisk.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        return [200, params.ip];
    });

    $httpBackend.whenGET(/^\/disks\/delete.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        return [200, params.ip];
    });

    $httpBackend.whenGET(/^\/machines\/attachDisk.*/).respond(function(method, url, data) {
        var params = new URI(url).search(true);
        return [200, params.ip];
    });

    $httpBackend.whenGET("/restmachine//system/usermanager/whoami").respond(function(method, url, data) {
        return [200, '"admin"'];
    });

    var users = [
      {'gravatarurl': 'http://www.gravatar.com/avatar/9e27b8f31707a720d054a5e4ce097279', 'username': 'admin'},
      {'gravatarurl': 'http://www.gravatar.com/avatar/fc948c1e0934f72fdaef932028371da0', 'username': 'karim'},
      {'gravatarurl': 'http://www.gravatar.com/avatar/76a24c11c492aee13ac83c55501334da', 'username': 'fernando'},
      {'gravatarurl': 'http://www.gravatar.com/avatar/76a24c11c492aee13ac83c55501334da', 'username': 'friedrich'},
      {'gravatarurl': 'http://www.gravatar.com/avatar/76a24c11c492aee13ac83c55501334da', 'username': 'anees'}
    ];

    $httpBackend.whenGET(/^\/users\/getMatchingUsernames.*/).respond(function(method, url, data) {
      var params = new URI(url).search(true),
          query = params.usernameregex;

      var results = _.filter(users, function(user) {
        return user.username.indexOf(query) != -1;
      });

      return [200, results];
    });

    $httpBackend.whenGET(/.html/).passThrough();
};
