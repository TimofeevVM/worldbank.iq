$(document).ready(function(){
    initDateDeposit();
    initSlider('sumDeposit');
    initSlider('addSumDeposit');
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
