// const iform = document.querySelector('#contactf')
// const isubj = document.querySelector('#subj');
// const imsg = document.querySelector('#msgs');
// const iname = document.querySelector('#cname');
// const igendm = document.querySelector('#gendm');
// const igendf = document.querySelector('#gendf');
// const itel = document.querySelector('#phone');
// const iemail = document.querySelector('#email');

// const icontact = document.querySelector('#lcontact');
// const emsg = document.querySelector('.emsg');

// iform.addEventListener('submit', onSubmit);
// function onSubmit(e) {
//     e.preventDefault();

//     if (isubj === '' || imsg.value === '' || iname.value === '' || itel.value === '' || iemail.value === '') {
//         if (igendf === '' && igendm === '') {
//             emsg.classList.add('Error');
//             emsg.innerHTML = "<p style='color: red; text-align: center;'>Please enter all fields.</p>";
//         }
//     }
//     else {


//         const li = document.createElement('li');
//         li.style = "list-style-type: none;";
//         var br = document.createElement('br');
//         li.appendChild(br);

//         if (igendm.value === 'male') {
//             const text = document.createTextNode(`[Male] ${iname.value} : ${iemail.value}`);
//             li.appendChild(text);
//         } else {
//             const text = document.createTextNode(`[Female] ${iname.value} : ${iemail.value}`);
//             li.appendChild(text);
//         }

//         var br = document.createElement('br');
//         li.appendChild(br);

//         const ssub = document.createTextNode(`Subject : ${isubj.value}`);
//         li.appendChild(ssub);

//         var br = document.createElement('br');
//         li.appendChild(br);

//         const smsg = document.createTextNode(`Message : ${imsg.value}`);
//         li.appendChild(smsg);

//         var br = document.createElement('br');
//         li.appendChild(br);

//         const stel = document.createTextNode(`Tel : ${itel.value}`);
//         li.appendChild(stel);
//         var br = document.createElement('br');
//         li.appendChild(br);

//         const del = document.createElement("button");

//         del.id = `${iname.value}${isubj.value}`; //FOR CONFIRM DESTINATION LI.
//         const para = document.createTextNode("Delete");
//         del.appendChild(para);

//         //DELETING SELECT LI
//         del.addEventListener("click", removing);
//         function removing() {
//             var ul = document.getElementById("lcontact");
//             var item = document.getElementById(del.id);
//             ul.removeChild(item);
//         }
//         li.appendChild(del);

//         var br = document.createElement('br');
//         li.appendChild(br);
//         var br = document.createElement('br');
//         li.appendChild(br);

//         icontact.appendChild(li);
//         isubj.value = '';
//         imsg.value = '';
//         iname.value = '';
//         document.getElementById('gendf').checked = false;
//         igendf.value = '';
//         document.getElementById('gendm').checked = false;
//         igendm.value = '';
//         itel.value = '';
//         iemail.value = '';
//     }
// }
//----------- OLD ROUGH CODE (AND NOT DONE LocalStorage) -----------

//----------------------- IMPROVED CODE ----------------------------
class fcomment {
    constructor(name, subj, msg, gender, phone, email) {
        this.name = name;
        this.subj = subj;
        this.msg = msg;
        this.gender = gender;
        this.phone = phone;
        this.email = email;
    }
}

//NEW CONTACT
document.querySelector('#contactf').addEventListener('submit', building);
function building(e) {
    e.preventDefault();

    const emsg = document.querySelector('.emsg');

    const isubj = document.querySelector('#subj');
    const imsg = document.querySelector('#msgs');
    const iname = document.querySelector('#cname');
    const itel = document.querySelector('#phone');
    const iemail = document.querySelector('#email');
    var igender = document.getElementsByName('gender');
    var igender_confirm;
    for (var i = 0; i < igender.length; i++) {
        if (igender[i].checked) {
            igender_confirm = igender[i];
            break;
        }
    }

    if (isubj.value === '' || imsg.value === '' || iname.value === '' || itel.value === '' || iemail.value === '' || igender_confirm.value === '') {
        emsg.classList.add('Error');
        emsg.innerHTML = "<p style='color: red; text-align: center;'>Please enter all fields.</p>";
    } else {
        const contact = new fcomment(iname.value, isubj.value, imsg.value, igender_confirm.value, itel.value, iemail.value);

        datazone.Add(contact);
        storage.addContact(contact);

        //Clearing fields
        isubj.value = '';
        imsg.value = '';
        iname.value = '';
        for (var i = 0; i < igender.length; i++) {
            igender[i].checked = false;
        }
        igender_confirm = '';
        itel.value = '';
        iemail.value = '';

    }


}

//DELETE CONTACT
document.querySelector('#lcontact').addEventListener('click', destroy)
function destroy(e) {
    //console.log(e.target);
    datazone.Remove(e.target);
    storage.removeContact(e.target.id);
    //console.log(e.target.id);
}

class datazone {

    static Add(contact) {
        const ul = document.querySelector('#lcontact');
        const li = document.createElement('li');
        li.innerHTML = `[${contact.gender}] Name : ${contact.name} ( E-Mail : ${contact.email} / Tel. ${contact.phone}) <br>
                        Subject : ${contact.subj}<br>
                        Message : ${contact.msg}<br>
                        <button type="button" class="del" id="${contact.gender}${contact.name}${contact.email}${contact.phone}${contact.subj}">Delete</button>`;

        ul.appendChild(li);
    }
    static Remove(delbut) {
        if (delbut.classList.contains('del'))
            delbut.parentElement.remove();
    }

    //DATA FROM STORAGE
    static ShowStorage() {
        const contacts = storage.ContactLists();

        for (var i = 0; i < contacts.length; i++) {
            datazone.Add(contacts[i]);
        }
    }
}


//LocalStorage 
document.addEventListener('DOMContentLoaded', datazone.ShowStorage);

class storage {

    static ContactLists() {
        let contacts;
        if (localStorage.getItem('contacts') === null) {
            contacts = [];
        } else {
            contacts = JSON.parse(localStorage.getItem('contacts'));
        }

        return contacts;
    }

    static addContact(contact) {
        const contacts = storage.ContactLists();
        contacts.push(contact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    static removeContact(code) {
        const contacts = storage.ContactLists();

        for (var i = 0; i < contacts.length; i++) {
            let ccode = `${contacts[i].gender}${contacts[i].name}${contacts[i].email}${contacts[i].phone}${contacts[i].subj}`;
            if (ccode == code)
                contacts.splice(i, 1);
        }
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
}