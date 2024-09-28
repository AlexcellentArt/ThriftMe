import React, { useState, useContext, useEffect } from "react";

import { AuthContext } from "./AuthContext";
function Favorite(id) {
  const { token, getUser, NotLoggedIn } = useContext(AuthContext);
  const [favorite, setFavorite] = useState(false);
  useEffect(() => {
    async function isFavorite() {
      try {
        if (NotLoggedIn()) {
          setFavorite(false);
          return;
        }
        const response = await fetch(
          `http://localhost:3000/api/user/favorite/${id}`,
          { headers: { token: token } }
        );
        //              is the fetch call path above correct?
        const res = await response.json();
        const json = await res.json();
        if (!res.ok) {
          console.error(await res.text());
        } else {
          setFavorite(json.is_favorite);
        }
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    }
    isFavorite();
  }, []);
  async function toggleFavorite(id) {
    // const user = await getUser()
    if (NotLoggedIn()) {
      return;
    } else {
      console.log(user);
      const res = await fetch(`http://localhost:3000/api/user/favorite`, {
        headers: { token: token },
        method: "PUT",
        body: { item_id: id },
      });
      const json = await res.json();
      if (!res.ok) {
        console.error(await res.text());
      } else {
        setFavorite(json.is_favorite);
      }
    }
  }
  return (
    <button
      className={`relative-right-corner icon ${
        favorite ? "favorite" : "unfavorite"
      }`}
      onClick={() => {
        toggleFavorite(id);
      }}
    >
      <svg
        width="127.47mm"
        height="131.66mm"
        version="1.1"
        viewBox="0 0 127.47 131.66"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          transform="translate(-.26384 -.36109)"
          stroke-linecap="square"
          stroke-linejoin="bevel"
        >
          <path
            d="m38.431 0.37311c-19.483-0.5272-37.274 16.372-38.082 35.797-1.0099 12.796 7.1031 23.794 14.741 33.2 10.89 12.532 20.562 27.405 22.472 44.258 0.67578 6.247-0.33934 12.638-2.709 18.396 8.2333-4.6312 16.39-10.092 24.514-15.155 19.593-12.776 39.212-25.961 55.911-42.449 9.3457-9.4481 15.046-23.478 11.288-36.674-4.1222-16.319-20.473-28.797-37.451-27.216-6.7957 0.46167-13.457 2.8712-18.942 6.9154-6.8344-10.524-19.195-17.172-31.743-17.071z"
            fill="black"
            stroke-width="1.355"
          />
          <path
            d="m44.221 7.0878c-16.663-0.46606-31.878 14.474-32.569 31.646-0.86372 11.312 6.0748 21.035 12.607 29.35 9.3138 11.079 17.585 24.227 19.219 39.126 0.57795 5.5226-0.29021 11.173-2.3168 16.263 7.0414-4.0941 14.017-8.9218 20.965-13.398 16.756-11.295 33.536-22.951 47.817-37.527 7.9928-8.3524 12.868-20.755 9.6538-32.421-3.5254-14.427-17.509-25.458-32.029-24.06-5.8119 0.40814-11.509 2.5382-16.2 6.1135-5.845-9.3039-16.416-15.18-27.148-15.092z"
            fill="#f9f9f9"
            stroke-width="1.1782"
          />
        </g>
      </svg>
    </button>
  );
}

export default Favorite;
