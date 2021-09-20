function ColorBtnClassChange(e) {
    let btnColor = document.querySelector('#' + e);
    var setColor = color;
    var wordColor = wordBadge;
    console.log(setColor);

      if(setColor == 1){
        btnColor.classList.remove('btn-light');
        btnColor.classList.add('btn-primary');
        setColor = 2;
        wordColor = "blue";
      }

      else if(setColor == 2){
        btnColor.classList.remove('btn-primary');
        btnColor.classList.add('btn-success');
        setColor = 3;
        wordColor = "green";
      }

      else if(setColor == 3){
        btnColor.classList.remove('btn-success');
        btnColor.classList.add('btn-light');
        setColor = 1;
        wordColor = "white";
      }
      
      color = setColor;
      wordBadge = wordColor;
      console.log(wordBadge);

      // var color => index.js , line 98
}