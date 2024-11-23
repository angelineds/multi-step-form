document.addEventListener('DOMContentLoaded', function() {
  const sidebarNumber = document.querySelectorAll('.sidebar-step_button');

  const nextButton = document.getElementById('next-page');
  const prevButton = document.getElementById('prev-page');
  const confirmButton = document.getElementById('confirm-page');
  const pageStep = document.querySelectorAll('.form-step');

  const inputName = document.getElementById('form-name');
  const inputEmail = document.getElementById('form-email');
  const inputPhone = document.getElementById('form-phone');
  const warningMessage = document.querySelectorAll('.form-warning');

  const switchButton = document.getElementById('switch-btn');
  const planName = document.querySelectorAll('.plan-name');
  const planPrice = document.querySelectorAll('.plan-price');
  const planFreeMonth = document.querySelectorAll('.plan-addOn');
  const planChoice = document.querySelectorAll('.plan-choice');
  const warningPlanMessage = document.querySelector('.plan-warning');

  const addOnCheckbox = document.querySelectorAll('.addOn-checkbox');
  const addOnItems = document.querySelectorAll('.addOn-item');
  const addOnName = document.querySelectorAll('.addOn-item_title');
  const addOnPrice = document.querySelectorAll('.addOn-price');

  const changePlanButton = document.querySelector('.confirm-head_btn');
  const confirmPlanTitle = document.querySelector('.confirm-head_title');
  const confirmPlanPrice = document.querySelector('.confirm-head_price');
  const confirmAddOn = document.querySelectorAll('.confirm-item');
  const confirmAddOnName = document.querySelectorAll('.confirm-item_text');
  const confirmAddOnPrice = document.querySelectorAll('.confirm-item_price');
  const confirmTotal = document.querySelector('.confirm-total_price');

  let currentStep = 0;

  let planChosen = "";
  let planDuration = "Monthly";

  function updateStep() {
    pageStep.forEach((step, index) => {
      step.classList.toggle('active', index === currentStep);
    });
    sidebarNumber.forEach((page, index) => {
      page.classList.toggle('active', index === currentStep);
    });
    prevButton.classList.toggle('off', currentStep === 0);
    nextButton.classList.toggle('off', currentStep === 3);
    confirmButton.classList.toggle('on', currentStep === 3);
  }

  function validateInput() {
    let isValid = true;
    const atSymbolCount = inputEmail.value.split('@').length - 1;

    if (inputName.value.trim() === '') {
      inputName.classList.add('warning');
      warningMessage[0].classList.add('active');
      isValid = false;
    } else {
      inputName.classList.remove('warning');
      warningMessage[0].classList.remove('active');
    }

    if (inputEmail.value.trim() === '' || atSymbolCount !== 1 ||
        inputEmail.value.startsWith('@') || inputEmail.value.endsWith('@')) {
          inputEmail.classList.add('warning');
          warningMessage[1].classList.add('active');
          isValid = false;
    } else {
      inputEmail.classList.remove('warning');
      warningMessage[1].classList.remove('active');
    }

    if (inputPhone.value.trim() === '') {
      inputPhone.classList.add('warning');
      warningMessage[2].classList.add('active');
      isValid = false;
    } else {
      inputPhone.classList.remove('warning');
      warningMessage[2].classList.remove('active');
    }

    return isValid;
  }

  function calculateTotal() {
    const planPriceText = confirmPlanPrice.textContent;
    const planPriceValue = parseInt(planPriceText.match(/\d+/)[0]);

    const addOnTotal = addOnPaid.reduce((total, priceText) => {
      const addOnPriceValue = parseInt(priceText.match(/\d+/)[0]); 
      return total + addOnPriceValue;
    }, 0);

    const total = planPriceValue + addOnTotal;
    const planFormat = planPriceText.includes('/yr') ? '/yr' : '/mo';
    return `$${total}${planFormat}`;
  }

  planChoice.forEach((choice, index) => {
    choice.addEventListener('click', () => {
      planChoice.forEach(item => item.classList.remove('active'));
      choice.classList.add('active');
      planChosen = planName[index].textContent;
      confirmPlanPrice.textContent = planPrice[index].textContent
    });
  });

  switchButton.addEventListener('change', () => {
    planFreeMonth.forEach((addFree) => {
      if (switchButton.checked) {
        addFree.style.display = 'block';
        planDuration = "Yearly";
        planPrice[0].textContent = '$90/yr';
        planPrice[1].textContent = '$120/yr';
        planPrice[2].textContent = '$150/yr';
        addOnPrice[0].textContent = '$10/yr';
        addOnPrice[1].textContent = '$20/yr';
        addOnPrice[2].textContent = '$20/yr';
      } else {
        addFree.style.display = 'none';
        planDuration = "Monthly";
        planPrice[0].textContent = '$9/mo';
        planPrice[1].textContent = '$12/mo';
        planPrice[2].textContent = '$15/mo';
        addOnPrice[0].textContent = '$1/mo';
        addOnPrice[1].textContent = '$2/mo';
        addOnPrice[2].textContent = '$2/mo';
      }
    });

    planChoice.forEach((choice) => choice.classList.remove('active'));
    planChosen = ""; 
    confirmPlanPrice.textContent = "";
  });

  let addOnChosen = [];
  let addOnPaid = [];

  addOnCheckbox.forEach((addOn, index) => {
    addOn.addEventListener('change', () => {
      if (addOn.checked) {
        addOnItems[index].classList.add('active');
        addOnChosen.push(addOnName[index].textContent);
        addOnPaid.push(addOnPrice[index].textContent);
      } else {
        addOnItems[index].classList.remove('active');
        
        const addOnIndex = addOnChosen.indexOf(addOnName[index].textContent);
        if (addOnIndex > -1) {
          addOnChosen.splice(addOnIndex, 1);
        }

        const addOnPaidIndex = addOnPaid.indexOf(addOnPrice[index].textContent);
        if (addOnPaidIndex > -1) {
          addOnPaid.splice(addOnPaidIndex, 1);
        }
      }

      confirmTotal.textContent = calculateTotal();
    });
  });

  nextButton.addEventListener('click', () => {
    if (currentStep === 0) {
      if (validateInput()) {
        currentStep++;
        updateStep();
      }
    } else if (currentStep === 1) {
      if (planChosen === "") {
        warningPlanMessage.classList.add('active');
      } else {
        warningPlanMessage.classList.remove('active');
        currentStep++;
        updateStep();
        
        confirmPlanTitle.textContent = `${planChosen} (${planDuration})`;
      }
    } else if (currentStep < pageStep.length - 1){
      currentStep++;
      updateStep();

      for (let item = 0; item < 3; item++) {
        confirmAddOn[item].classList.remove('on');
      }

      for (item in addOnChosen) {
        confirmAddOn[item].classList.add('on');
        confirmAddOnName[item].textContent = addOnChosen[item];
        confirmAddOnPrice[item].textContent = addOnPaid[item];
      }
    }
  });

  prevButton.addEventListener('click', () => {
    if (currentStep === 2) {
      addOnChosen = [];
      addOnPaid = [];
      addOnCheckbox.forEach((checkbox, index) => {
        checkbox.checked = false;
        addOnItems[index].classList.remove('active');
      });
      currentStep--;
      updateStep();

    } else if (currentStep > 0){
      currentStep--;
      updateStep();
    }
  });

  confirmButton.addEventListener('click', () => {
    pageStep[3].classList.remove('active');
    sidebarNumber[3].classList.remove('active');
    pageStep[4].style.display = 'flex';
    prevButton.classList.add('off');
    confirmButton.classList.remove('on');
  });

  changePlanButton.addEventListener('click', () => {
    addOnCheckbox.forEach((checkbox, index) => {
      checkbox.checked = false;
      addOnItems[index].classList.remove('active');
    });

    addOnChosen = [];
    addOnPaid = [];

    currentStep = 1;
    updateStep();
  });

  updateStep();
});