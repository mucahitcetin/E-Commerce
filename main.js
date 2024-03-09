const categoryList = document.querySelector('.categories');
const productList = document.querySelector('.products');
const modal = document.querySelector('.modal-wrapper');
const openBtn = document.querySelector('#open-btn');
const closeBtn = document.querySelector('#close-btn');
const modalList = document.querySelector('.modal-list');
const modalInfo = document.querySelector('#modal-info');
const categoriesImg = ["food.jpg", "electronic.jpeg", "furniture.jpg", "shoes.jpeg"];
const productImg = ["product1.jpeg", "product2.jpeg", "product3.jpeg", "product4.jpeg", "electronic.jpeg", "electronic.jpeg", "shoes.jpeg", "shoes.jpeg"];

document.addEventListener('DOMContentLoaded', () => {
  // callback > içerisinde farklı fonksiyonlar çalıştırır
  fetchCategories();
  fetchProduct();
});
// Kategorileri Çekme
function fetchCategories()  {   
// veri çekme isteği atma
    fetch ('https://api.escuelajs.co/api/v1/categories')
    // gelen veriyi işleme
    .then(response => response.json())
     // işlenen veriyi foreach ile herbir obje için ekrana basma
    .then ((data) => 
    data.slice(0, 4).forEach((category, index) => {
        //slice, gelen tüm diziler içinden filtreleme yaparak hangilerini alacağımıza yarıyor
        
        const { name } = category;
    // gelen herbir obje için div oluşturma
        const  categoryDiv =  document.createElement('div');
    // dive class ekleme
         categoryDiv.classList.add('category');
    // divin içeriğini değiştirme, süslü parantezlerin içindeki veriler dinamik veriler  
        categoryDiv.innerHTML = `
        <img src="images/${categoriesImg[index]}" />
        <span>${name}</span>
    `;
    // oluşan divi htmldeki listeye atma
    categoryList.appendChild(categoryDiv);
    }) 
    )
    .catch(error => console.error('Veri alınamadı:', error));
}

// Ürünleri Çekme
function fetchProduct() {
    // apiye veri çekme isteği  atma
    fetch('https://api.escuelajs.co/api/v1/products')
      // istek başarılı olursa veriyi işle
      .then((res) => res.json())
      // işlenen veriyi al ve ekrana bas
      .then((data) =>
        data.slice(1, 9).forEach((item, index) => {
          // div oluştur
          const productDiv = document.createElement('div');
          // dive class ekle
          productDiv.classList.add('product');
          // divin içeriğini değiştir
          productDiv.innerHTML = `
          <img src="images/${productImg[index]}" />
              <p>${item.title}</p>
              <p>${item.category.name}</p>
              <div class="product-action">
                <p>${item.price} $</p>
                <button onclick="addToBasket({id:${item.id},title:'${item.title}',price:${item.price},img:'images/.jpeg', amount:1})">Sepete Ekle</button>
              </div>
          `;
          // oluşan ürünü htmldeki listeye gönderme
          productList.appendChild(productDiv);
        })
      );
  }

  // Sepet
let basket = [];
let total = 0;

// sepete ekleme işlemi
function addToBasket(product) {
  // sepette parametere olarak gelen eremanı arar
  const foundItem = basket.find((basketItem) => basketItem.id === product.id);

  if (foundItem) {
    // eğer elemandan varsa bulunan elmanın miktarını arttır
    foundItem.amount++;
  } else {
    // eğer elemandan sepette bulunmadıysa sepete ekle
    basket.push(product);
  }
}


// Açma ve Kapatma
openBtn.addEventListener("click", ()=>{
    modal.classList.add( "active" ) ;
    // sepetin içine ürünleri listeleme
  addList();
  // toplam bilgisini güncelleme
  modalInfo.innerText = total;
});

closeBtn.addEventListener("click", ()=>{
    modal.classList.remove( "active" ) ;
     // sepeti kaptınca içini temizleme
  modalList.innerHTML = '';
  // toplam değerini sıfırlama
  total = 0;
});

// sepete listeleme fonksiyonu
function addList() {
  basket.forEach((product, index) => {
   /*  console.log(product); */
    // sepet dizisindeki her obje için div oluştur
    const listItem = document.createElement('div');
    // bunlara class ekle
    listItem.classList.add('list-item');
    // içeriğini değiştir
    listItem.innerHTML = `
    <img src="images/${productImg[index]}" />
              <h2>${product.title}</h2>
              <h2 class="price">${product.price}  $</h2>
              <p>Miktar: ${product.amount}</p>
              <button id="del" onclick="deleteItem({id:${product.id},price:${product.price} ,amount: ${product.amount}})">Sil</button>
    `;
    // elemanı htmldeki listeye gönderme
    modalList.appendChild(listItem);

    // toplam değişkenini güncelleme
    total += product.price * product.amount;
  });
}

// sepet dizisinden silme fonksiyonu
function deleteItem (deletingItem){
  basket =  basket.filter((i)=> i.id !== deletingItem.id);
  // silinen elemanın fiyatını total'den çıkartma
  total -= deletingItem.price * deletingItem.amount;

  modalInfo.innerText = total;
}

// silinen elemanı htmlden kaldırma
modalList.addEventListener( 'click',(e)  =>{
  if(e.target.id == 'del') {
    e.target.parentElement.remove();
  }
  });

// eğer dışarıya tıklanırsa kapatma
modal.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-wrapper')) {
    modal.classList.remove('active');
  }
});