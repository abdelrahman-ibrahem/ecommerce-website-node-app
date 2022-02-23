document.getElementById('submit').onclick = function() {
    var radios = document.getElementsByName("contact");
    var selected = Array.from(radios).find(radio => radio.checked);
    alert(selected.value);
}
document.getElementById('rd1').addEventListener('click' , e=>{
    e.preventDefault();
    let size ;
    e.forEach(el => {
        if (el.checked){
            size = el.value;
        }
    });
    document.cookie = `name=${size}`;
});