var svgConstants = require('../constants/svgConstants');

var navData = {
    "utility": [
        [{
            "screen_id": "pptl_management",
            "code": "CLIENTCODE_004",
            "image": svgConstants.pptl,
            "message": "Unexpected Item",
            "showImage": true,
            "level": null,
            "type": 'active'
        }],
        [{
            "screen_id": "scanner_management",
            "code": "CLIENTCODE_005",
            "image": svgConstants.scanner,
            "message": "Unexpected Item",
            "showImage": true,
            "level": null,
            "type": 'active'
        }]
    ],
    "putBack": [
        [{
            "screen_id": "put_back_invalid_tote_item",
            "code": "Common.000",
            "image": svgConstants.exception,
            "message": "Unexpected Item",
            "showImage": true,
            "level": null,
            "type": 'active'
        }],
        [{
            "screen_id": ["put_back_stage","put_back_scan_tote"],
            "code": "Common.000",
            "image": svgConstants.stage,
            "message": "Stage Bin or Scan Item",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": ["put_back_scan","put_back_tote_close"],
            "code": "Common.001",
            "image": svgConstants.scan,
            "message": "Scan & Confirm",
            "showImage": true,
            "level": 2,
            "type": 'passive'
        }]
    ],
    "putFront": [
        [{
            "screen_id": "put_front_waiting_for_rack",
            "code": "Common.000",
            "message": "Wait For MSU",
            "showImage": false,
            "level": 1,
            "type": 'active'
        }],
        [{
            "screen_id": "put_front_scan",
            "code": "Common.000",
            "image": svgConstants.scan,
            "message": "Scan Item From Bin",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": "put_front_place_items_in_rack",
            "code": "Common.001",
            "image": svgConstants.rack,
            "message": "Place Item in slot and scan more",
            "showImage": true,
            "level": 2,
            "type": 'passive'
        }]
    ],
    "pickFront": [
        [{
            "screen_id": "pick_front_waiting_for_msu",
            "code": "Common.000",
            "message": "Wait For MSU",
            "showImage": false,
            "level": 1,
            "type": 'active'
        }],
        [{
            "screen_id": ["pick_front_location_scan", "pick_front_container_scan", "pick_front_item_scan" , "pick_front_more_item_scan"],
            "code": "Common.000",
            "image": svgConstants.scan,
            "message": "Scan Slot Barcode",
            "showImage": true,
            "level": 1,
            "type": 'passive'
        }, {
            "screen_id": "pick_front_pptl_press",
            "code": "Common.001",
            "image": svgConstants.pptl,
            "message": "PPTL",
            "showImage": true,
            "level": 2,
            "type": 'passive'
        }],
        [{
            "screen_id": "pick_front_no_free_bin",
            "code": "Common.000",
            "image": svgConstants.exception,
            "message": "Wait For MSU",
            "showImage": true,
            "level": null,
            "type": 'active'
        }]
    ],
    "pickBack": [ {
        "screen_id": "pick_back_scan",
        "code": "Common.001",
        "image": svgConstants.scan,
        "message": "Scan Tote ",
        "showImage": true,
        "level": 1,
        "type": 'passive'
    },{
        "screen_id": "pick_back_bin",
        "code": "Common.000",
        "image": svgConstants.place,
        "message": "Remove Item",
        "showImage": true,
        "level": 2,
        "type": 'passive'
    }],
    "audit": [
        [{
            "screen_id": "audit_front_waiting_for_msu",
            "code": "Common.000",
            "message": "Wait For MSU",
            "showImage": false,
            "level": 1,
            "type": 'active'
        }],
        [ 
        {
        "screen_id": "audit_front_waiting_for_location_scan",
        "code": "Common.001",
        "image": svgConstants.scan,
        "message": "Scan MSU Barcode ",
        "showImage": true,
        "level": 1,
        "type": 'passive'
        },
        {
        "screen_id": "audit_scan",
        "code": "Common.001",
        "image": svgConstants.scan,
        "message": "Scan Items ",
        "showImage": true,
        "level": 2,
        "type": 'passive'
    },
    ,{
        "screen_id": "audit_reconcile",
        "code": "Common.000",
        "image": svgConstants.place,
        "message": "Status",
        "showImage": true,
        "level": 3,
        "type": 'passive'
    }]
    ]

};

module.exports = navData;
