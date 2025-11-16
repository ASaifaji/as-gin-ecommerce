export const useAuth = () => {
  const token = localStorage.getItem("token");
  return !!token; // true jika token ada, false jika tidak
};
