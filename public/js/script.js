(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
  
  document.addEventListener("DOMContentLoaded", () => {
    const indiaStateCityMap = {
      "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati", "Guntur", "Kakinada", "Nellore", "Rajahmundry", "Ongole", "Eluru", "Anantapur"],
      "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Aalo", "Bomdila", "Tezu"],
      "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur", "Nagaon", "Tinsukia", "Dhubri", "Bongaigaon", "Sivasagar"],
      "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Arrah", "Begusarai", "Katihar", "Munger"],
      "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Korba", "Rajnandgaon", "Raigarh", "Jagdalpur", "Ambikapur"],
      "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem"],
      "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar", "Jamnagar", "Junagadh", "Anand", "Mehsana"],
      "Haryana": ["Gurugram", "Faridabad", "Panipat", "Hisar", "Karnal", "Rohtak", "Sonipat", "Ambala", "Yamunanagar", "Bhiwani"],
      "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Mandi", "Solan", "Kullu", "Hamirpur", "Una", "Palampur"],
      "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Ramgarh"],
      "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", "Shivamogga", "Tumakuru", "Davangere", "Udupi", "Ballari"],
      "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Kannur", "Palakkad", "Kottayam", "Malappuram"],
      "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Satna", "Rewa", "Ratlam", "Khandwa"],
      "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Kolhapur", "Solapur", "Amravati", "Navi Mumbai"],
      "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Kakching"],
      "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin", "Baghmara"],
      "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip"],
      "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
      "Odisha": ["Bhubaneswar", "Cuttack", "Puri", "Rourkela", "Sambalpur", "Berhampur", "Balasore", "Bhadrak", "Baripada"],
      "Punjab": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Pathankot", "Hoshiarpur", "Moga", "Firozpur"],
      "Rajasthan": ["Jaipur", "Udaipur", "Jodhpur", "Kota", "Ajmer", "Bikaner", "Alwar", "Bhilwara", "Sikar", "Pali"],
      "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
      "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Erode", "Tirunelveli", "Vellore", "Thoothukudi", "Kanchipuram"],
      "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Nalgonda", "Ramagundam", "Mahbubnagar"],
      "Tripura": ["Agartala", "Udaipur", "Kailasahar", "Dharmanagar"],
      "Uttar Pradesh": ["Lucknow", "Noida", "Varanasi", "Agra", "Kanpur", "Prayagraj", "Gorakhpur", "Meerut", "Bareilly", "Jhansi", "Aligarh"],
      "Uttarakhand": ["Dehradun", "Rishikesh", "Haridwar", "Nainital", "Haldwani", "Almora", "Rudrapur", "Roorkee"],
      "West Bengal": ["Kolkata", "Siliguri", "Darjeeling", "Howrah", "Durgapur", "Asansol", "Sankrail", "Bardhaman", "Malda"],
      "Andaman and Nicobar Islands": ["Port Blair", "Diglipur"],
      "Chandigarh": ["Chandigarh"],
      "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa", "Diu"],
      "Delhi": ["New Delhi", "Dwarka", "Rohini", "Saket", "Karol Bagh", "Connaught Place", "Laxmi Nagar", "Pitampura"],
      "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Pahalgam", "Pulwama", "Kupwara"],
      "Ladakh": ["Leh", "Kargil", "Nubra"],
      "Lakshadweep": ["Kavaratti", "Agatti"],
      "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"]
    };
  
    document.querySelectorAll("[data-india-location-picker]").forEach((picker) => {
      const stateSelect = picker.querySelector("[data-state-select]");
      const citySelect = picker.querySelector("[data-city-select]");
  
      if (!stateSelect || !citySelect) {
        return;
      }
  
      const selectedState = stateSelect.dataset.selected || "";
      const selectedCity = citySelect.dataset.selected || "";
  
      const populateCities = (stateName) => {
        const cities = indiaStateCityMap[stateName] || [];
        citySelect.innerHTML = '<option value="" selected disabled>Choose city...</option>';
  
        if (!stateName || cities.length === 0) {
          citySelect.disabled = true;
          return;
        }
  
        citySelect.disabled = false;
        cities.forEach((city) => {
          const option = document.createElement("option");
          option.value = city;
          option.textContent = city;
          if (city === selectedCity) {
            option.selected = true;
          }
          citySelect.appendChild(option);
        });
      };
  
      stateSelect.innerHTML = '<option value="" selected disabled>Choose state or UT...</option>';
      Object.keys(indiaStateCityMap).forEach((stateName) => {
        const option = document.createElement("option");
        option.value = stateName;
        option.textContent = stateName;
        if (stateName === selectedState) {
          option.selected = true;
        }
        stateSelect.appendChild(option);
      });
  
      populateCities(selectedState);
  
      stateSelect.addEventListener("change", () => {
        citySelect.dataset.selected = "";
        populateCities(stateSelect.value);
      });
    });
  
    document.querySelectorAll("form[data-min-images]").forEach((form) => {
      const minImages = Number(form.dataset.minImages || 0);
      const fileInput = form.querySelector("input[type='file'][data-min-images]");
      if (!fileInput || !minImages) {
        return;
      }
  
      const getTotalImages = () => {
        const selectedImages = fileInput.files ? fileInput.files.length : 0;
        const currentImageCount = Number(form.dataset.currentImageCount || 0);
        const deletedCount = form.querySelectorAll(".delete-image-checkbox:checked").length;
        return currentImageCount - deletedCount + selectedImages;
      };
  
      form.addEventListener("submit", (event) => {
        const totalImages = getTotalImages();
        if (totalImages < minImages) {
          event.preventDefault();
          event.stopPropagation();
          fileInput.classList.add("is-invalid");
          const message = form.querySelector("[data-image-help-message]");
          if (message) {
            message.textContent = `A minimum of ${minImages} images is required. You currently have ${totalImages}.`;
          }
        }
      });
  
      fileInput.addEventListener("change", () => {
        if (fileInput.files.length >= minImages || getTotalImages() >= minImages) {
          fileInput.classList.remove("is-invalid");
        }
      });
    });
  });
})()