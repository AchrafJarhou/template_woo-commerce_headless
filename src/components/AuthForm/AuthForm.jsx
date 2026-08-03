// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import { loginThunk, registerThunk } from "../../thunkActionsCreator/userThunks";
// import { closeAuthModal, switchAuthModalView } from "../../slices/authModalSlice";

// export default function AuthForm() {
//   const dispatch = useDispatch();
//   const { view } = useSelector((state) => state.authModal);
//   const { loading, error, token } = useSelector((state) => state.user);

//   const mode = view === "register" ? "register" : "login";

//   const [step, setStep] = useState(1);
//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (token) dispatch(closeAuthModal());
//   }, [dispatch, token]);

//   useEffect(() => {
//     setStep(1);
//     setErrors({});
//   }, [mode]);

//   const validateLogin = () => {
//     const newErrors = {};
//     if (!form.username.trim())
//       newErrors.username = "Le nom d'utilisateur est requis.";
//     if (!form.email.trim())
//       newErrors.email = "L'adresse e-mail est requise.";
//     if (!form.password) newErrors.password = "Le mot de passe est requis.";
//     else if (form.password.length < 8)
//       newErrors.password = " Il faut au moins 8 caractères.";
//     return newErrors;
//   };

//   const validateRegisterStep1 = () => {
//     const newErrors = {};
//     if (!form.username.trim())
//       newErrors.username = "Le nom d'utilisateur est requis.";
//     if (!form.email.trim()) {
//       newErrors.email = "L'adresse e-mail est requise.";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
//       newErrors.email = "Entrez une adresse e-mail valide.";
//     }
//     if (!form.password) {
//       newErrors.password = "Le mot de passe est requis.";
//     } else if (form.password.length < 8) {
//       newErrors.password = " Il faut au moins 8 caractères.";
//     }
//     return newErrors;
//   };

//   const validateRegisterStep2 = () => {
//     const newErrors = {};
//     if (!form.confirmPassword) {
//       newErrors.confirmPassword = "Veuillez confirmer votre mot de passe.";
//     } else if (form.confirmPassword !== form.password) {
//       newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
//     }
//     return newErrors;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleBack = () => {
//     setErrors({});
//     setStep(1);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (mode === "login") {
//       const validation = validateLogin();
//       if (Object.keys(validation).length > 0) {
//         setErrors(validation);
//         return;
//       }
//       dispatch(
//         loginThunk({ username: form.username.trim(), password: form.password }),
//       );
//       return;
//     }

//     if (step === 1) {
//       const validation = validateRegisterStep1();
//       if (Object.keys(validation).length > 0) {
//         setErrors(validation);
//         return;
//       }
//       setErrors({});
//       setStep(2);
//       return;
//     }

//     const validation = validateRegisterStep2();
//     if (Object.keys(validation).length > 0) {
//       setErrors(validation);
//       return;
//     }
//     const { confirmPassword, ...payload } = form;
//     dispatch(registerThunk(payload));
//   };

//   const subtitle =
//     mode === "login"
//       ? ""
//       : step === 1
//         ? "Rejoignez-nous"
//         : "Confirmez votre mot de passe";

//   const submitLabel =
//     mode === "login"
//       ? loading
//         ? "Signing in…"
//         : "Se connecter"
//       : step === 1
//         ? "Suivant"
//         : loading
//           ? "Création du compte…"
//           : "Créer le compte";

//   return (
//     <>
//       <h1>{mode === "login" ? "Bonjour" : "Créer un compte"}</h1>
//       {subtitle && <p className="auth-modal__subtitle">{subtitle}</p>}

//       <form className="auth-form" onSubmit={handleSubmit} noValidate>
//         {(mode === "login" || step === 1) && (
//           <>
//             <div className="auth-form__field">
//               <label htmlFor="username">Nom d'utilisateur</label>
//               <input
//                 id="username"
//                 name="username"
//                 type="text"
//                 value={form.username}
//                 onChange={handleChange}
//                 className={errors.username ? "input--error" : ""}
//                 autoComplete="username"
//               />
//               {errors.username && (
//                 <span className="auth-form__error">{errors.username}</span>
//               )}
//             </div>

//             <div className="auth-form__field">
//               <label htmlFor="email">E-mail</label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 className={errors.email ? "input--error" : ""}
//                 autoComplete="email"
//               />
//               {errors.email && (
//                 <span className="auth-form__error">{errors.email}</span>
//               )}
//             </div>

//             <div className="auth-form__field">
//               <label htmlFor="password">Mot de passe</label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 className={errors.password ? "input--error" : ""}
//                 autoComplete={
//                   mode === "login" ? "current-password" : "new-password"
//                 }
//               />
//               {errors.password && (
//                 <span className="auth-form__error">{errors.password}</span>
//               )}
//             </div>
//           </>
//         )}

//         {mode === "register" && step === 2 && (
//           <div className="auth-form__field">
//             <label htmlFor="confirmPassword">Confirmez le mot de passe</label>
//             <input
//               id="confirmPassword"
//               name="confirmPassword"
//               type="password"
//               value={form.confirmPassword}
//               onChange={handleChange}
//               className={errors.confirmPassword ? "input--error" : ""}
//               autoComplete="new-password"
//               autoFocus
//             />
//             {errors.confirmPassword && (
//               <span className="auth-form__error">{errors.confirmPassword}</span>
//             )}
//           </div>
//         )}

//         {mode === "login" && (
//           <button
//             type="button"
//             className="auth-form__forgot"
//             onClick={() => dispatch(switchAuthModalView("reset-password"))}
//           >
//             Vous avez oublié votre mot de passe ?
//           </button>
//         )}

//         {mode === "register" && step === 2 && (
//           <button
//             type="button"
//             className="auth-form__forgot"
//             onClick={handleBack}
//           >
//             Retour
//           </button>
//         )}

//         {error && (
//           <p
//             className="auth-form__server-error"
//             dangerouslySetInnerHTML={{ __html: error }}
//           />
//         )}

//         <button className="auth-form__submit" type="submit" disabled={loading}>
//           {submitLabel}
//         </button>

//         {mode === "login" && (
//           <button
//             type="button"
//             className="auth-form__submit"
//             onClick={() => dispatch(switchAuthModalView("register"))}
//           >
//             S'inscrire
//           </button>
//         )}
//       </form>

//       {mode === "register" && (
//         <p className="auth-modal__footer">
//           <button
//             type="button"
//             className="auth-modal__link"
//             onClick={() => dispatch(switchAuthModalView("login"))}
//           >
//             Vous avez déjà un compte ? Se connecter
//           </button>
//         </p>
//       )}
//     </>
//   );
// }
