
    const maxNotesLimit = 40;
    let ATMInfo;
    
    

    (async function(){

        const URL = './data/atm-info.json';
        ATMInfo = await fetch(URL);
        ATMInfo = await ATMInfo.json();
        console.log(ATMInfo);
        return ATMInfo;
      
       
    })(); 
    
    let countBancnotes=[];// здесь будет массив с номиналом и количество выданных купюр
    let countlimitedNotes =0;
    let userInputSum;  
    function calc() {
        countBancnotes=[];
        countlimitedNotes=0;

        let requestSum = +inputSum.value;
        userInputSum = requestSum;

        console.log(requestSum);
        for(let i=0; i< ATMInfo.length ; i++ ){
            //requestSum%ATMInfo[i].denomination
            if (requestSum>= ATMInfo[i].denomination){
                

                if(ATMInfo[i].quantity == 0){
                    continue;
                }

                /*36 600*/let countNeeded= Math.trunc(requestSum/ATMInfo[i].denomination);//количество купюр , которое нужно выдать
                if(countNeeded > ATMInfo[i].quantity){
                    countNeeded = ATMInfo[i].quantity;
                    
                }
                    if(  countNeeded >= maxNotesLimit-countlimitedNotes ) {
                        countNeeded = maxNotesLimit-countlimitedNotes;
                        countlimitedNotes = countlimitedNotes+countNeeded;
                        countBancnotes.push(
                            {"denomination": ATMInfo[i].denomination ,//20 ; 10
                            "quantity": countNeeded} //4; 1
                        );
                        
                        //можем выдать только 40купюр за один раз
                        requestSum = requestSum - ATMInfo[i].denomination*countNeeded;
                        ATMInfo[i].quantity = ATMInfo[i].quantity - countNeeded;
                        break;
                        
                    }else{
                        countlimitedNotes = countlimitedNotes+countNeeded;
                        countBancnotes.push(
                            {"denomination": ATMInfo[i].denomination ,//20 ; 10
                            "quantity": countNeeded} //4; 1
                        );
        
                        requestSum = requestSum - ATMInfo[i].denomination*countNeeded;//90- 20*4=10; 10-1*10
                        ATMInfo[i].quantity = ATMInfo[i].quantity - countNeeded; //5-4=1; 3-1=2
        
                        if (requestSum ==0 ){
                            break;
                        }
                    }
                

                

            }
        }

        console.log(countBancnotes);
        console.log(ATMInfo);

        let sumCountBancnotes = countBancnotes.reduce(
            (acc, currValue) => acc + currValue.denomination*currValue.quantity,
            0
        );

        let sumATMInfo = ATMInfo.reduce(
            (acc, currValue) => acc + currValue.quantity,
            0
        );
        
    
        countBancnotes = countBancnotes.map( item => `
        <tr class="d-flex justify-content-center" style ="width: 300px;">
            
            <td >${item.denomination} </td>
            <td >*</td>
            <td >${item.quantity} </td>
            <td >=</td>
            <td >${item.denomination * item.quantity}</td>
            
        </tr>
       `);

        countBancnotes = countBancnotes.join('');

        let TableBody = document.querySelector('tbody');
        TableBody.innerHTML=countBancnotes;

        let outputMes = document.getElementById('message1');
            
        let output = document.getElementById('message2');
        output.hidden = true;
        outputMes.hidden = true;

        if(userInputSum>sumCountBancnotes){
            output.hidden = false;
            
            if (countBancnotes.length == 0 ){
                output.innerHTML = 'The ATM is not working due to technical reasons.';
            } else {
                output.innerHTML = `You can get ${sumCountBancnotes}. 
                Try to get the rest of the amount ${userInputSum-sumCountBancnotes} again`;
            }
            
            

            if (  (userInputSum-sumCountBancnotes==1) && (ATMInfo[ATMInfo.length-1].quantity == 0) ){
                output.innerHTML = `You can get ${sumCountBancnotes}.`;
            }

            

            if (countlimitedNotes == maxNotesLimit ){
                
                outputMes.hidden = false;
                outputMes.innerHTML = "<strong>You have exceeded the banknote limit!</strong>";
                
            }

           
            
        }


    } 
      
    


   
    /*
    let xhr = new XMLHttpRequest();

    xhr.open('GET', './data/atm-info.json');

    xhr.onload = function(){

        const ATMInfo = JSON.parse(this.response);

        console.log(ATMInfo);

        /* Вы можете разместить свой код здесь *

    }

    xhr.send();
    */
    