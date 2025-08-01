import { toast } from "react-toastify";

export function cookiesToObjects(cookies: string): any {
    const splitedCookies = cookies.split(';');

    const cookiesArray = splitedCookies.reduce((acc, currentCookie, currentIndex) => {
        const key = currentCookie.split('=')[0].trim();
        const value = currentCookie.split('=')[1].trim();

        return { ...acc, [key]: value }
    }, {})

    return cookiesArray;
}

export function emitToaster(type: 'success' | 'warn' | 'error', message: string, closingTime: number = 5000) {
    toast[type](message, {
        position: "bottom-center",
        autoClose: closingTime,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    });
}

export function buildQueryParams(params: Record<string, any>) {
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue

    if (typeof value === 'object' && !Array.isArray(value)) {
      for (const [subKey, subValue] of Object.entries(value)) {
        if (subValue !== undefined && subValue !== null) {
          query.append(`${key}[${subKey}]`, subValue.toString()) // <- colchetes aqui
        }
      }
    } else {
      query.append(key, value.toString())
    }
  }

  return query.toString()
}
