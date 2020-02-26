CKEDITOR.plugins.add( 'showdevice',
    {
        init: function( editor )
        {
            // Plugin logic goes here...
            editor.addCommand( 'showdeviceDialog', new CKEDITOR.dialogCommand( 'showdeviceDialog'));
            editor.ui.addButton( 'showdevice',
                {
                    label: 'Insert a value of Device',
                    command: 'showdeviceDialog',
                    icon: this.path + 'images/icon.png'
                });
        }
    });

CKEDITOR.dialog.add( 'showdeviceDialog', function( editor )
{
    return {
        title : 'Device Properties',
        minWidth : 600,
        minHeight : 400,
        contents :
        [
            {
                id : 'general',
                label : 'Settings',
                elements :
                    [
                        // UI elements of the Settings tab.
                        {
                            type : 'html',
                            html : 'This dialog window lets you create simple links for your website.'
                        },
                        {
                            type : 'select',
                            id : 'ddlDevice',
                            label : 'Select Device',
                            validate : CKEDITOR.dialog.validate.notEmpty( 'Device' ),
                            required : true,
                            items: devices,
                            onChange: function( api ) {
                                let device_id = this.getValue();
                                editor.fire( 'dllDevice_Onchage', { device_id : device_id } );
                            }
                        },
                        {
                            type : 'html',
                            html : '<div id="devicetree-properties" style="font-size: 20px"></div>'
                        }

                    ]
            }
        ],
        onShow : function() {

            var mySelection = editor.getSelection().getSelectedText();

            if(mySelection){
                var mySelection =mySelection.replace('{','');
                mySelection =mySelection.replace('}','');
                var index = mySelection.indexOf('.');
                if(index){
                    var idSelect = mySelection.substring(index+1,mySelection.length);
                }

                var myselect = mySelection.split('.');
                this.setValueOf("general","ddlDevice",myselect[0]);

                let list ={
                    "id": myselect[0]
                };

                $.ajax({
                    url: '/getId',
                    dataType:"json",
                    //contentType:"application/json",
                    type:"POST",
                    data:list,
                    success: (request)=>{
                        if(request.data){
                            let jsonData = request.data;

                            setTimeout(function () {
                                $("#devicetree-properties").jstree("destroy");
                                $('#devicetree-properties').jstree('deselect_all');

                                $('#devicetree-properties').on('changed.jstree', function (e, data) {
                                    var objNode = data.instance.get_node(data.selected);
                                    $('#jstree-result').append('Selected: <br/><strong>' + objNode.id+'-'+objNode.text+'</strong>');
                                }).jstree({
                                    core: {
                                        data: jsonData
                                    }/*,
                                'checkbox': {
                                    three_state: false,
                                    cascade: 'up'
                                },
                                'plugins': ["checkbox"]*/
                                });

                                $("#devicetree-properties").on("loaded.jstree", function(){
                                    // don't use "#" for ID
                                    $('#devicetree-properties').jstree(true).select_node(idSelect);
                                });
                            },500);
                        }
                    },
                    error: function(request, status, error){
                        console.log(error);
                    }
                });
            }
        },
        onOk: function (){
            var dialog = this;
            var ddlDevice = dialog.getValueOf('general', 'ddlDevice');

            var result;
            $(function () {
                result = $('#devicetree-properties').jstree('get_selected');
            });

            var formula;
            var idtest;
            if(result.length > 0){
                formula= '{{' + ddlDevice;
                idtest = '{' + ddlDevice;
                for(var i=0; i< result.length;i++){
                    formula += '.'+result[i];
                    idtest += '.'+result[i];

                }
                formula += '}}';
                idtest += '}';
            }else {
                formula = '';
            }


            var container = new CKEDITOR.dom.element('a');

            container.data('source',formula);

            container.setAttributes( {
                'href':'#',
                'class':'item-device'
            } );

            //container.appendText(formula);
            container.appendText(idtest);

            //insert Element to Ckeditor content
            editor.insertElement(container);

            $(function () {
                $("#devicetree-properties").jstree("destroy");
                $('#devicetree-properties').jstree('deselect_all');
            });
        },
        onCancel: function () {
            $(function () {
                $("#devicetree-properties").jstree("destroy");
                $('#devicetree-properties').jstree('deselect_all');
            });
        }
    };

});