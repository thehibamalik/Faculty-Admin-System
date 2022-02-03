/**
 * Generic field validator with optional RegExp argument
 */
function genericValidate(elementID, regex){

    var rgx;

    if(typeof regex != undefined)
        rgx = new RegExp(regex);
    else
        rgx = new RegExp(/[\s\S]+/g);
    
    if( $(elementID).val() == ""){
        $(elementID).css("border","1px solid red");
        $(elementID).next().css("display","block");
        $(elementID).next().text("This field is required.");
        return false;
    }else if(!rgx.test($(elementID).val())){
        $(elementID).css("border","1px solid red");
        $(elementID).next().css("display","block");
        $(elementID).next().text("The format is not valid");
        return false;
    }else{
        $(elementID).css("border","1px solid green");
        $(elementID).next().css("display","none");
        return true;
    } 
}