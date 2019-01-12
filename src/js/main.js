$(document).ready(function(){
    initDateDeposit();
    initSlider('sumDeposit');
    initSlider('addSumDeposit');

    initCalcForm();
});

function initDateDeposit() {
    const $dateDeposit = $("#dateDeposit");
    $($dateDeposit).datepicker();
    $($dateDeposit).datepicker( "option", "dateFormat", "dd.mm.yy");
    $( $dateDeposit ).datepicker( "option",
        $.datepicker.regional[ "ru" ]
    );
    $( $dateDeposit ).datepicker( "setDate", new Date());
}
function initSlider(name){
    const $slider    = $( "#slider-"+name );
    const $input     = $( "#input-"+name );

    const positionHandle = () => {
        const $handle = $slider.find('.ui-slider-handle');
        $handle.css('margin-left', -1 * $handle.width() * ($slider.slider('value') / $slider.slider('option', 'max')));
    };

    $slider.slider({
        range: "min",
        min: 1000,
        max: 3000000,
        value: 100000,
        slide: function( event, ui ) {
            $input.val( ui.value );
            positionHandle();
        }
    });


    $input.val( $slider.slider( "value" ) );

    positionHandle();

    $input.keyup( ()=>
        $slider.slider("option", "value",
            parseInt($input.val())
        )
    );

    $input.change(validateSum);
    $input.keypress(handleIsDigit);

}

function handleIsDigit(){
   return event.charCode >= 48 && event.charCode <= 57;
}

function validateSum(e){
    const sum = $(e.target).val();
    const min = 1000;
    const max = 3000000;
    if (sum < min){
        $(e.target).val(min);
    } else{
        if (sum > max){
            $(e.target).val(max);
        }
    }
}

function initCalcForm(){
    $form = $('#form-calc');
    $form.submit(handleSubmitCalcForm);
}

function handleSubmitCalcForm(e){
    e.preventDefault();

    $.ajax({
        type: "POST",
        url: "/api/calc.php",

        data: JSON.stringify({
            data:getFormData($(e.target))
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
            const $res = $($('.result')[0]);
            $res.show();
            $res.find('.result__value').text(formatStr(data.response+''));
        },
        failure: function(err) {
            console.log(err);
        }
    });
}

function formatStr(str) {
    str = str.replace(/(\.(.*))/g, '');
    var arr = str.split('');
    var str_temp = '';
    if (str.length > 3) {
        for (var i = arr.length - 1, j = 1; i >= 0; i--, j++) {
            str_temp = arr[i] + str_temp;
            if (j % 3 == 0) {
                str_temp = ' ' + str_temp;
            }
        }
        return str_temp;
    } else {
        return str;
    }
}

function getFormData($form){
    const unindexed_array = $form.serializeArray();
    const indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}
