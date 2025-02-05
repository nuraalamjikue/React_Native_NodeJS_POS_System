// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';

// i18n
//     .use(LanguageDetector) // Automatically detect user language
//     .use(initReactI18next) // Passes i18n down to react-i18next
//     .init({
//         resources: {
//             en: {
//                 translation: {
//                     welcome: "Welcome to our application!",
//                     language: "Select Language",
//                 },
//             },
//             fr: {
//                 translation: {
//                     welcome: "Bienvenue dans notre application!",
//                     language: "Choisir la langue",
//                 },
//             },
//             es: {
//                 translation: {
//                     welcome: "¡Bienvenido a nuestra aplicación!",
//                     language: "Seleccionar idioma",
//                 },
//             },
//         },
//         fallbackLng: "en", // Default language
//         interpolation: {
//             escapeValue: false, // React already escapes values
//         },
//     });

// export default i18n;




import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Get the language from localStorage or use a default
const savedLanguage = localStorage.getItem('language') || 'en';

i18n
    .use(LanguageDetector) // Automatically detect user language
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        resources: {
            en: {
                translation: {
                    btnSubmit: "Submit",
                    btnCancel: "Cancel",
                    CategoryList: "Category List",
                    addCategory: "Add Category",
                    UpdateCategory: "Update Category",
                    Edit_category_name: "Edit category name",
                    Enter_category_name: "Enter category name",
                    language: "Select Language",
                    // ---------------Table------------------------
                    Id: "Id",
                    category_name: "Category Name",
                    Action: "Action",

                    // -----------------Product Page -----------------------
                    Item_Name: "Product Name",
                    Item_Price: " Product Price",
                    Product_CategoryID: "Category",
                    Product_IsActive: "IsActive",
                    Product_ImageUpload: "Upload Image",
                    Submit: "Submit",
                    Update: "Update",
                    Product_Cancle_btn: "Cancle"

                },

            },
            fr: {
                translation: {
                    btnSubmit: "Soumettre",
                    btnCancel: "Annuler",
                    CategoryList: "Liste des catégories",
                    addCategory: "Ajouter une catégorie",
                    UpdateCategory: "Catégorie de mise à jour",
                    Edit_category_name: "Modifier le nom de la catégorie",
                    Enter_category_name: "Entrez le nom de la catégorie",
                    language: "Choisir la langue",
                    // ---------------Table------------------------
                    Id: "Id",
                    category_name: "nom de la catégorie",
                    Action: "Action",

                    // -----------------Product Page -----------------------
                    Item_Name: "Nom du produit",
                    Item_Price: "Prix ​​du produit",
                    Product_CategoryID: "Catégorie",
                    Product_IsActive: "Est actif",
                    Product_ImageUpload: "Télécharger une image",
                    Submit: "Soumettre",
                    Update: "Mise à jour",
                    Product_Cancle_btn: "Annuler"

                },
            },
            es: {
                translation: {
                    welcome: "¡Bienvenido a nuestra aplicación!",
                    language: "Seleccionar idioma",
                },
            },
        },
        lng: savedLanguage, // Set the initial language
        fallbackLng: "en", // Default language if no match is found
        interpolation: {
            escapeValue: false, // React already escapes values
        },
    });

export default i18n;
