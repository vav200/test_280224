import "./App.css";
import { useEffect, useState } from "react";
import md5 from "crypto-js/md5";
import { format } from "date-fns";

function App() {
  const [items, setItems] = useState([]);
  const [offsetItems, setOffsetItems] = useState(0);
  const [param, setParam] = useState("product");
  const [searchingText, setSearchingText] = useState("");

  const url = "https://api.valantis.store:41000/";
  const password = "Valantis";
  const dateNow = Date.now();
  const timestamp = format(dateNow, "yyyyMMdd");
  const authString = md5(`${password}_${timestamp}`).toString();

  function findItemsByParam(e) {
    e.preventDefault();

    if (searchingText) {
      let numericValue = parseFloat(searchingText);
      let dataparam = "";

      if (!isNaN(numericValue)) {
        dataparam = numericValue;
      } else {
        dataparam = searchingText;
      }

      let requestSearchItem = {
        action: "filter",
        params: { [param]: dataparam },
      };

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth": authString,
        },
        body: JSON.stringify(requestSearchItem),
      })
        .then((dat) => dat.json())
        .then((dat) => {
          let requestItems = {
            action: "get_items",
            params: { ids: dat.result },
          };

          fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Auth": authString,
            },
            body: JSON.stringify(requestItems),
          })
            .then((dat) => dat.json())
            .then((dat) => {
              setItems(dat.result);
            });
        });
    }
  }

  function getData() {
    let requestIds = {
      action: "get_ids",
      params: { offset: offsetItems, limit: 50 },
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth": authString,
      },
      body: JSON.stringify(requestIds),
    })
      .then((dat) => {
        if (!dat.ok) {
          throw new Error(`Ошибка HTTP: ${dat.status}`);
        }
        return dat.json();
      })
      .then((dat) => {
        let requestItems = {
          action: "get_items",
          params: { ids: dat.result },
        };

        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Auth": authString,
          },
          body: JSON.stringify(requestItems),
        })
          .then((dat) => dat.json())
          .then((dat) => {
            setItems(dat.result);
          });
      })
      .catch((error) => {
        console.error("Ошибка запроса:", error.message);
      });
  }

  useEffect(() => {
    getData();
  }, [offsetItems]);

  return (
    <div>
      <div className="searchBlock">
        <form className="searchBlock__form">
          <select
            className="searchBlock__item"
            defaultValue={"product"}
            onChange={(e) => setParam(e.target.value)}
          >
            <option value="product">по названию</option>
            <option value="price">по цене</option>
            <option value="brand">по бренду</option>
          </select>
          <input
            type="text"
            placeholder="введите искомый параметр"
            className="searchBlock__inp searchBlock__item"
            onChange={(e) => setSearchingText(e.target.value)}
            value={searchingText}
          />
          <input
            type="submit"
            value="найти"
            className="searchBlock__item"
            onClick={findItemsByParam}
          />
        </form>
      </div>
      <ul className="items">
        <li className="zagl">
          <div className="box id">ID</div>
          <div className="box name">Название</div>
          <div className="box price">Цена</div>
          <div className="box brend">Бренд</div>
        </li>
        {items.map((el) => (
          <li className="str">
            <div className="box id">{el.id}</div>
            <div className="box name">{el.product}</div>
            <div className="box price">{el.price}</div>
            <div className="box brend">{el.brand}</div>
          </li>
        ))}
      </ul>
      <div className={`pagin ${!searchingText ? "" : "pagin__hide"}`}>
        <span className="prev" onClick={() => setOffsetItems((x) => (x !== 0 ? x - 50 : x))}>
          &#60;&#60; prev
        </span>
        <span>page {Math.floor(offsetItems / 50) + 1}</span>
        <span
          className="next"
          onClick={() => {
            setOffsetItems((x) => (items.length < 50 ? x : x + 50));
          }}
        >
          next &#62;&#62;
        </span>
      </div>
    </div>
  );
}

export default App;
