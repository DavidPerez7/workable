import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../../components/Header/Header';
import Footer from '../../../../components/Footer/Footer';
import './KFCPage.css';

const KFCPage = () => {
  const navigate = useNavigate();

  const Exit = () => {
    try {
      navigate('/HomePage');
    } catch (error) {
      console.error('Error navigating to HomePage:', error);
    }
  };

  return (
    <>
      <Header />
      <main className="mainKfc" role="main">
        <section className="sectionHeaderKfc">
          <div className="headerContentKfc">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAA0lBMVEX////8+/v/ACkAAAABAQH8////AAD/ABz86uv6gIjU1NRjY2PKyspfW1zHxsZoaGhWVlatrKzR0NDAv7/29fXs6+vg39/l5ORRUVGzsrK5uLihoKCMi4t3dnbv7u7CwcGRkJBJSEiZmJgqKir/ABOko6Nwb2+DgoL/ACIbGho0MzMhISE7Ojr9lJtEQ0P8ycwREBD9a3b73+H+Pk/8p638uL3+UmD819r9nKP9eoP6wMT+MUX+GDP8t7v+UF772dv9rbL+RFX9YW39jZX+Ijr9ZXDG4zp6AAAUq0lEQVR4nO2dCbfiNtKGRQTdE7NdwNjsl6WBvkAIyUwyk22WJN///0ufqsqLbGRJJj1NzTl5c3K67wWD/bSWKlWpJMSfeobGcRyhgv+yoqLissaglVKIejYXg7aSrSbBs+EUFcNNnU6X63UDmqBeUN3H9WLRJNcm01XponRS2qVSd7Z8Nh9dYykvw2ffRJUaqtEfnn0TmnayrW6Kq0Qg5ejZiDK9yje+qJTEVN0gF/XlFGC13PrUTD2+Emm9yejZkFLd5Bhu/Mef3n94Z9dfnLT0z3Wz+qHiez6Q3n/84hv80KOcPQtOWVKG6sa/fffxC4ccsOCzotl22e93D8f1/HUsHMBaX753feWH71XbEgv5+mRGmXbQslr/+OC6cSss9TnR/KVkIi17VlwesL54B7CWks1kvVEjQqP1tz8CS5Fa3BJC540yo3Ypr8W4GpcPrJ8BVpfPmNWWHQXrl8dhCTE9IZnDfrhKPzWeLZPmtarC5QHr418B1lWOnwlI11GZMY3W1w/DUrYHkkK3REcohgd8ZV5BywcWjllvsuF4hs+mtRwoWH9/9zAsKZtNReT+RSHCNdC6mBuXB6z337TwC57NKNNebkVD/OVRWKphNRUsNTwZXw2xNw5Nr/nA+hIsLUawZviY4YOwwLNEVHFFZxPBWb08M7zqA+srBWslT89mlKmnHFV154/AUlcPkdUxtFkV0Lim92/wsbP+pmBFcvJsRpkC+QKwnDbpHSzRiKYTYLWLsw8z45opWp2713xgfddqqH+P/hPxFBXLC8D6qa4FL9AGVcPVUojOtn25nTfLmbmFQfuTdxaXD6yvWzAoHp/NKFMobwDrn7XdnVji0N6PlprVfjCOXaIj5e4BWO/+1YJVh/WzGeVSk42682/cd17uhkOZTIQ4xDebtllxf/+CDyz1lWIu989GlEtK/zvXHl9ptZMJIXlOaKkfTqa+KNToFteHFaIfzWbRIfWkv6oHS2wnuzccshSdwRjMtWYzxWXqisrEeCn+2gcW+dG9ZyPKNfH0pHVYIh+n2h31GdN81AJaY0PTOkoZFGj5uDsAqy0ZBXj66El/Vw8WjVO3wwwie+FG/X23HfV60wX61NE9LGVbynZNWB9/Ij86dj7DZxMsRPp40gVYCzVgRwBK/RDe0EZPFC93xnUZ0ZVyVRMW+tFnySjUSp70v5wmfHHMkmj4419PRSvKYpoWFiDcsNj50UIMPD3pIqx52k7E2mRxGhRKNH/rwOLmR4MnffTypIuwgtTfU9McrIjZBa+LS7EfesAiP3r3bEKaOp6edBHWQEKDJK9n4mxXMA/CfKivPrhhgR8tIrl5NiFNET5sy8WqOMBHMOcRgWbJJDBoDE4C8D3Wg0V+dPvZhDSN5Qlg/dXlHGqwwNdTHpv6ywFWHZwNa6w8FnSPNvVggR89YpUZ0iDn8PsasBrg4AgMreOSshuW+gpsjbVgvft7C9rj+tmEdHl60jksNbo3cVBXY7aCFRsB6YpxtBqrq8JasMCP3nLyo9OYtNet5w8vqcWAc+M2G8bYAQGWtgbo8Y3s/GihjMrYJyatj1nUoVQXUbAObljgSo4FwDrnTcsDVgtHRUZ+tFCTv5rOWv+uA2uDLQuG9yaM3W5aUr0N22FuZni4Oy00TRj50QL/7RqtH+vAWuMSgniDxzfGucqwpqofRvDutj8s8qMvnPzozJN2WaUl00E5lA1ce3CjoqbVGAKsbQ1Y6EffOPnRAucbSDryhwWY+qKhmop8ibxy3ERbjl6L7dAJi6EfLdCS8fCkCxb8FZ5hCMj88gHFXrbB2Jc1ZkOGfrRAG1ndVS1Ya/B2RhWBeROsIS2iHurAAj96zMqPFuh9qXuvMcDjoLUHZ680nmh0SlpRbGNUAxZDP1rg/ah7/70GLOgdXVj7TBfeb+fdtbvI2plqrstNltImb5f+ksJm2ie4YYEf3WEUjwat0M9r/cfhHBaXaNSgtZPN/fAmdU1CASullA2iaT+7IqxuHd8Q/egZo3g0ipzDX2vACt8wYCGXczXGLzBpbUeBnWHY6Yy3WfhVdrcLZcEu1jv6zbZGN+ToR6dh1h9c914wSptJIPoWirALBoQIdzIBRPFpeRqtosuuAWmr8rRP+uzM33Tg6EcLZYiv1L3/VgNWW8rLYEfrM3v5NhSrwWL7QmP47i2JUwejQaDcg5F69xF2csjRUl/+c8MKeSXBk64YZnV50jqsLjjGMcB6U6NTOGynzQmcP/V5TWp2ECqcUuqf6EF/qgcLbFKIarJSG8wlZ8KyDuuIwxwNQ1nXI0tqClaunGcj/LaN6znKKJsCrHUNR7qFORKs/GhIzRt5eNI6rL16fsomRVRt5evGvdcoWZAPId4TzebbaRAfcfAXMK1tRainALpgkR994pPXTfJLWNZhBdCzRtiyxmtYJCczVNJaqBic4swqPV6w76nuGIEpG/jD+p5cQ1Z+dJqw7PKkS7kOW1hcRs84y9wWh2SVvWjKL+Wr+jkY4vZif9OBpR8NOTA+CcsFWF2w+pOUmdxsP5eTP+C3jYSQ+vfY6CFGJyzwo0N2sPwSlguwBjBoncmw2hIp0VO2BDYiHZXonHHpCxTWMkrRj44Z5XWT/BKWC+7OWCosfQVnv8elB9G+4NxX2hULBllmLYCpNfSHhX50wCivm+SXsFz0DXeKwVbB6ilHHGIX7euL3F3yliNo0O9O1tnqYGJweMMCP7rHajs5KJRN4U5YLsJaq0Y0U7CyZqNGvjDIlmBEcNsnU2Q+h+4KI5oL1ruvMVWZmR/tGWYtwhpK2RsqWM2s3agP2edmlOqnp0ZRK5mNXl6wIK8bJmpm8gqzlrKVIfMWBngKmwpI2GoMMW0Cf4YI/7UwgEE2mx689vk+NAGZaYdhVkfCcgnWJFlbACJoQTXli/IDN2RDxhMAuS5ccSgO/05YDYzO8inqkGiCYVZHwnIJ1jpNfFeDSu+cLGDB/8dRZ0BbVYpL9KK0b8AJi1KV2eyPTtXHMKsjYbkEqyezvPd0wUHT2yjG9cEoG/+hnw7rwML90Rs++6NTeSUsl7ejyJxW8sd8RVtXKXd5hW1rTaxe2wtZSiFxwKL90We5ct79ZxaFWR0Jy+VdYYdsAwp1wTZsQxGrbfeyxPYE+VhNDMYiWVkw3z1g/UquIZv90am8wqzlljVOFrDkUg3mUCgp63CJaSXiUxJWFdTgCpe7YL3/gWGIFTTySVi+2xUWta+AIIYOh04JgeqN8p4zV7QETZ2bZSn/2wXrN0xVvj2HiEUdCrPWgwVoJmhngs112XeiKOrtMdJzWY+CKOgN+pIGKnFRE2F5OcIB68M/MMR6eTabOyVh1p/rwaIFrDjbyWMSpeeKm2EbogvWvzFVuftsNnda4SM5EpZNsNa4A0xN8OnEuA2g5mEUdE65GYY077N0XbB+ZJeqTGr4hFlNsGa0PrPMYN2mwbA33R7ekt2tZGmNTcUKHLCSEOvi2Wzu5eNJm+o6rLDJYG6pZqEmakMvBHNBGbCGjQUuWN9iiHX+bDT3unmEWU2w1Mh9wQz3HNamP9lcN/1toBrsmRxr8BzvLnXCAj/6CPEzbrrAfkpHmNUIa4D9TOQeT25DYlo27e+5lBYgvGBRqjKbOmO5uhhmtScsm2vRYIgC1kBp3JIXbXBSLQoXcFZl490H1geGqcoknzCruRZNG4Yj1Q+XIm1b+ZqVanf4x9w0ZDlgffydYaoyaeERZjXDWuMuHrGIBeaFyEDfRBFRL2xinY2asP7TwivZ+dHglrjDrGZYPVqHT6dEGU8D/eUG5sCbeqEL1q8sQ6wgCrPaPemK+llgH+A4NZYVWwhkaSe5Fyz0o/mFWEE+YdYKWJjXlm8RuyvpAPt2jNt7HLB+wxDr+dlkDErCrA/Mhsk2i7WAhR7DFjGsB2XcZGeHlYRYeaUqk5Iw6+82f6eq5h9uDZO37Qh2tZbbEOa/G2v5uGD9giFWTlt+UyVhVmvCcmXpzUlW7KhZdgGx1OTFfJ0DFqUq8/OjReoc/p/t9quLut5ybyeP1cP/YKzKW8VVdljoR++5pSqTKMxqTViuhIVFEhNY6fguBivRGEBzO1fVA3TA+hZDrMxSlUkUZrV60pZywRmtzHJQcyBGYeWlUXWVAxbLVGWSR5jVUohahMlaX54ncqAxrFt5jQsWy1RlEoVZrQnL1hLnAAeH+dT8pJU/8zzoA+sjhVgZ+tFeYVZ7PXhwaoAWlV9DR9FRo8YKi1KVd9xSlUkUZrV60q7i+fEZaUFaFobA5LWyYLcHrH+yTFUmeYRZ7d0QdMTmpPozBqD3IqyqpeWGxTRVmTTD3azWMKsN1vgwuezebjRsvYpOuuXpzdIR7bC+xBArT1geYVbbbDhId6MgrWOeBmFYTvaD9RVWVeaWqkxKwqwWVlZY28yGzzJF6K8Vro4TFvrRQzVdcNSYdrPaEpZtsBY6LJ3bw7C+w6rK3FKVSR51oR6CdXoUFtNUZRLtZrWFWR+CtXkQFqYqz/mlKpMozGq9fwusvb7lUA9M9x+FBSHWBb9UZdLFuZvVekhRbzAYTGejzhBTTfEhG6s46BgKB/vBaqALxS5VmeQOs7qNUhAWpE4XTB8/0ekdhVjZpSqT3GFWj4PVGlQlyqtamx3WzxRiZZeqTKIwq60ulA8stN2bXnUArbAoVfnGMcQKwjCrtS6UF6x+AuvV/V4rLL4hVtAU48o2T9oHVojLWIWaYg/BYhxiBVGY1VYXyucwyDmWejCExOrC+g2rQfE5X7Qod5jVBxZwuikL1eZA+8DCVOVAfQpPxVQ02FIXyg2LlmaOC1NkuiasX7AaFMcQKygk59ASZvWA1QVYAfg+HmUTrbB+5BtiBSVh1j8Ciw5ZowVTi+nuAYtziBXkDLM6YRGlNf3hLHtuh8U4xApy7mZ1wgqxYY0J1v1BarVgUYiVYaoyyRlmdcHC5VJY20RYzpMa7LAoxMqqqrIuZ5jV2bLQIH1NYJmOf/SHxTnECoJGbw2zuuKG2LBuyeYU0+mP/rDSECvDVGUS7PywhlldLUsmJbw/BSye1aBywZ4icA6rZYe1Op6kVvjcoxv+UP1VnEOsICoaLFrVcjy8cpm6GLtvA6yexxKF/bu4hlhBQ1t6kJ8EFeuBxCwPo9QlriFWUOTj/PpIzPbB2HL8r+/HDNlVg8q1Mu4ZeegxPcueOz5lxDTEivJaOP98UjMO0xAryPOAhc8lZcswDbGC3j7BoPwJxTfECrpK63EUxTcbfnf3nvv3Wz7q/vvYhlhBbftKwXQwHaSajrARis4s+910FjeEes80f1f6ynQ6e80braIzHBzbVzgreDdZznsVEyffECtoabO6cV+JJsxhCAu/esGT0yo0SEPUq/2k/Jo5eYRviBW0tp3NVMqTwYfPS2g1qS7+oCKXJlsLFFE/yx3RrjTDklxDrKB9sepc6daXskAGulVynnuSNXOLIZemghUVEQ4PUr8izaU0ew6cXcMkzFpNa6YlP1LlaaCVPPhlBLtONHpaNYw0TSs5TSZ98bxLyxuYA7J8Q6ygni2ZqpEXF8uPyhTJ2QJZCSMMstJ7zjMY2GeDtUwqJUKSbgZygcPRkA62MM8rPHexpgpsaXpJOIKelTaZpBt2tI0UlHCUNj5SRGsQyQ4MfK2f5CIJ2Hwn9QMita/juYs1VWw/XFUrZYRZH1ilDn5Sg1X2nryCT1a+FauJYAX59KW82+FOYfO3Mt3Fmiq0O4ciH3BgMxPYEvjTRtsjJ3YZkUiHdRGimb2ijYyAsGKk5BxiBVlh5cV56Oja9Gid4qPmo1L+67gzXOWJ8sWGFF7OO7PfwDnECjKXX0hvfqoNRxCmIlaFpfZ0dmw2C+dwC6HX6SwO5/C95u9jHGIFnaDUUSWsozYcZUN7Me6sTYZFky03Vz0OnU4uWfLcxZrqxXYAH5a4oOeN06F9V9ojl+b90fSXCF/IJwf3odPJZ7V57mJNdbCGkfPxfZSwein3IJF3tvYSdTwuQv3ipn1lQ/+sK2fXEMKsg8onoaNQElqyokeNc28nN+BX+sX+q7HizHMXa6qtJRPU5CTTgZvae2aG90BVczqhB3/0XufnWChY18DiHGrOjtZ8it3WtIOHgpH1x3eWhYJ1vVrSZmkzALJaax2yYGuIq76kkAhsC22W9O6GY4aFgnUNk63zJq20trHLaRW3E+ZzwGRzvV6u183kBa39vGWZHUHDP07ENvuWFFfvDtRK5S/TXRT4k1a4QRvGtegovvKa43XnbdGHdRgWCtZlcQ6zQxhww9eL1hHznAZtyaG8ihjnF3iGvbm7hjbnULMqldEe62t8Wb8qmKSly9/yC6rNk8IV7M5iLat6RNGWHBrFaS9vKppJWvYxtQ3n0ie/psHwLNaydlWbufJhiuZ+odsPqb0xtk15eluE2tLpB4sqP5ppgaNck6qEbEy5okdF6wJOdcwfnsZszfK8nyfyNQu0KxZDMjjj0fFk3j/GtcBRrn5FF9FiXmlhnqP+8EFSSDn7xX3NrHwNtZmYYacTnddtnh45Z9+SjsZMUDGe672uS8Hoi05rHuhzgOqr9y20GEtr5oEfc8/nWuAo19a4gBIWw6KpXbArdKyrKIxjBusWz0hullU1AXN3DZMc3LvbLrnHWb9paw+vjKJI72cmj1yEx3I4GoP+RljcXcM0B7f8jNtSakJqF4hgect+OcPirZnME4Vo0CFiuV62FcYKnSETRIFQvZFlGN+cgytWcRQFpCjShhgBtRvGsXotGgvVcMbJu6K4ssqYuiQa7dfH43Exnw4BQsX7yDUcNAdChgOG51gIPOWm6hkTmV8sva2CVPmzbLGkZGOmIvZynLDMAPx0Obh/VKlrqGAt1531k7mYxSYHN3UNT0K0xYpnIq41cvg5lSaUKitezRU8IxddWz7b55SQ3A14mA5lzIGWMvf5Hah2p4NkkfW6lHy3GmpSRmN3AFlos9Fo9ErqaerUFl6l/ut1egUlH66+ZjRDTVGDwR5OjmS+5JBoXs4lfoau/wvtCjU7Lg+HQ5/U/pTq+2nBfmz/U38q1/8DRu+4r8t97coAAAAASUVORK5CYII="
              alt="KFC Logo"
              aria-label="KFC Logo"
              className="kfcLogo"
            />
            <div className="companyInfoKfc">
              <h1 className="companyTitle">Kentucky Fried Chicken</h1>
              <p className="companyDescription">Empresa americana</p>
            </div>
          </div>
        </section>

        <section className="sectionDescriptionKfc">
          <div className="descriptionBlockKfc1">
            <h2 className="descriptionTitle">Acerca de Kentucky Fried Chicken</h2>
            <img
              src="https://ii.ct-stc.com/1/microsites/596A733D7F118967/banner%20kfc.jpg"
              alt="KFC Banner"
              aria-label="KFC Banner Image"
              className="bannerImageKfc"
            />
          </div>
          <div className="descriptionBlockKfc2">
            <img
              src="https://ii.ct-stc.com/1/microsites/596A733D7F118967/imagen%20okok.jpg"
              alt="KFC Purpose Image"
              aria-label="KFC Purpose Image"
              className="purposeImageKfc"
            />
            <div className="textContentKfc">
              <h3 className="subTitle">Nuestro Propósito</h3>
              <p className="contentText">
                Nuestro propósito es la democratización de alimentos de calidad, haciendo que a través de nuestras tiendas estén al alcance de todos los colombianos. El cuidado del medio ambiente y el bienestar de nuestros colaboradores y sus familias son nuestro compromiso. Apostamos por Colombia y donde estamos presentes, somos el mejor vecino.
              </p>
            </div>
          </div>
          <div className="descriptionBlockKfc3">
            <img
              src="https://thumbs.dreamstime.com/b/logotipo-del-restaurante-de-los-alimentos-preparaci%C3%B3n-r%C3%A1pida-kfc-en-su-edificio-sagunto-espa%C3%B1a-febrero-fri%C3%B3-el-pollo-situado-139640468.jpg"
              alt="KFC Restaurant"
              aria-label="KFC Restaurant Image"
              className="restaurantImageKfc"
            />
            <div className="textContentKfc2">
              <h3 className="subTitle">Nuestras Tiendas</h3>
              <p className="contentText">
                En KFC creemos en las personas. Más que una empresa de comida, somos una familia que valora el esfuerzo, la autenticidad y las ganas de crecer. Buscamos talentos que quieran aprender, aportar y formar parte de algo significativo. ¡Tu próxima oportunidad puede empezar aquí con nosotros!
              </p>
            </div>
          </div>
        </section>

        <section className="sectionPeopleKfc">
          <img
            src="https://d1wao037kgukun.cloudfront.net/oms/2879/image/2025/4/Q3TUK_file/file.webp"
            alt="KFC People"
            aria-label="KFC People Image"
            className="peopleImageKfc"
          />
          <div className="peopleContentKfc">
            <div className="peopleItemKfc">
              <h4 className="itemTitle">Nuestra Gente</h4>
              <p className="itemText">
                En KFC, las personas son el corazón de todo lo que hacemos. Nos apoyamos, nos respetamos y celebramos juntos cada logro. Aquí, cada voz cuenta.
              </p>
            </div>
            <div className="peopleItemKfc">
              <h4 className="itemTitle">Entrenamiento y Capacitación</h4>
              <p className="itemText">
                No necesitas saberlo todo al llegar. Te acompañamos con programas de formación prácticos y dinámicos para que crezcas con confianza desde el primer día.
              </p>
            </div>
            <div className="peopleItemKfc">
              <h4 className="itemTitle">Oportunidades de Crecimiento</h4>
              <p className="itemText">
                Muchos de nuestros líderes comenzaron atendiendo en caja o cocina. Si tienes ganas, actitud y compromiso, en KFC siempre habrá un siguiente paso para ti.
              </p>
            </div>
            <div className="peopleItemKfc">
              <h4 className="itemTitle">Empleo Seguro</h4>
              <p className="itemText">
                Ofrecemos un ambiente laboral estable, respetuoso y con condiciones claras. Queremos que trabajes tranquilo y te sientas valorado cada día.
              </p>
            </div>
            <div className="peopleItemKfc">
              <h4 className="itemTitle">Comunidad y Medio Ambiente</h4>
              <p className="itemText">
                Nos importa lo que pasa dentro y fuera de nuestras tiendas. Apoyamos causas sociales, promovemos la inclusión y trabajamos por un planeta más limpio y justo.
              </p>
            </div>
          </div>
        </section>

        <section className="sectionTestimonialsKfc">
          <h5 className="testimonialsTitle">Testimonios</h5>
          <div className="testimonialsContainerKfc">
            <div className="testimonialItemKfc1">
              <img
                src="https://media.istockphoto.com/id/1582548944/es/foto/joven-mujer-sonriente-de-piel-oscura-con-maquillaje-gafas-y-cabello-ondulado-posando-sobre-un.jpg?s=612x612&w=0&k=20&c=hDD7CRTe7SV9CCLQa9tvN7iydOIm24o3mkR6sisvQLg="
                alt="Testimonial Daniela Rodríguez"
                aria-label="Testimonial Image Daniela Rodríguez"
                className="testimonialImageKfc"
              />
              <p className="testimonialText">
                Entré a KFC buscando un empleo temporal, y hoy soy supervisora. Aquí aprendí a liderar, a trabajar en equipo y a confiar en mí misma. Me dieron la oportunidad de crecer y la aproveché.
              </p>
            </div>
            <div className="testimonialItemKfc2">
              <img
                src="https://media.istockphoto.com/id/1542565697/es/foto/foto-de-un-joven-empresario-feliz.jpg?s=612x612&w=0&k=20&c=9X5lOif5scGkLkmw4JzIY0_TiEuf6J89smXctSo4w2k="
                alt="Testimonial Andrés García"
                aria-label="Testimonial Image Andrés García"
                className="testimonialImageKfc"
              />
              <p className="testimonialText">
                Trabajar en KFC fue mi primer empleo. Aprendí disciplina, atención al detalle y a trabajar bajo presión. Me ayudó mucho para mi vida profesional y personal. Siempre recordaré el compañerismo.
              </p>
            </div>
          </div>
          <div className="testimonialsTextKfc">
            <div className="subTextKfc1">
              <p className="nameText">Daniela Rodríguez</p>
              <p className="roleText">Supervisora de tiendas</p>
            </div>
            <div className="subTextKfc2">
              <p className="nameText">Andrés García</p>
              <p className="roleText">Excolaborador de cocina</p>
            </div>
          </div>
        </section>

        <section className="sectionSocialMediaKfc">
          <h5 className="socialMediaTitle">Conoce más sobre nosotros en</h5>
          <div className="socialMediaContainerKfc">
            <img
              src="data:image/jpeg;base64,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"
              alt="Social Media Icons"
              aria-label="Social Media Icons"
              className="socialIconsKfc"
            />
            <div className="socialLinkKfc">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="90"
                height="90"
                fill="currentColor"
                className="socialIcon"
                aria-label="Facebook"
              >
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
              </svg>
            </div>
            <div className="socialLinkKfc">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="90"
                height="90"
                fill="currentColor"
                className="socialIcon"
                aria-label="Instagram"
              >
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
              </svg>
            </div>
            <div className="socialLinkKfc">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="90"
                height="90"
                fill="currentColor"
                className="socialIcon"
                aria-label="Twitter"
              >
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
              </svg>
            </div>
          </div>
        </section>

        <section className="sectionRatingsKfc">
          <h5 className="ratingsTitle">Puntuaciones</h5>
          <div className="generalRatingKfc" role="region" aria-label="General Ratings">
            <span className="ratingLabel">Evaluación general</span>
            <span className="ratingScore" aria-live="polite">4,5</span>
            <span className="ratingStars">★★★★★</span>
            <span className="ratingCount">3,952 Evaluaciones</span>
            <div className="ratingBarContainer">
              <span className="ratingValue">5</span>
              <div className="ratingBar">
                <div className="ratingBarFill" style={{ width: '69%' }}></div>
              </div>
              <span className="ratingPercentage">69%</span>
            </div>
            <div className="ratingBarContainer">
              <span className="ratingValue">4</span>
              <div className="ratingBar">
                <div className="ratingBarFill" style={{ width: '22%' }}></div>
              </div>
              <span className="ratingPercentage">22%</span>
            </div>
            <div className="ratingBarContainer">
              <span className="ratingValue">3</span>
              <div className="ratingBar">
                <div className="ratingBarFill" style={{ width: '7%' }}></div>
              </div>
              <span className="ratingPercentage">7%</span>
            </div>
            <div className="ratingBarContainer">
              <span className="ratingValue">2</span>
              <div className="ratingBar">
                <div className="ratingBarFill" style={{ width: '1%' }}></div>
              </div>
              <span className="ratingPercentage">1%</span>
            </div>
            <div className="ratingBarContainer">
              <span className="ratingValue">1</span>
              <div className="ratingBar">
                <div className="ratingBarFill" style={{ width: '1%' }}></div>
              </div>
              <span className="ratingPercentage">1%</span>
            </div>
            <div className="categoryRatingsKfc">
              <div className="ratingCategory">
                <span className="categoryScore">4,17</span>
                <span className="categoryLabel">Ambiente de trabajo</span>
              </div>
              <div className="ratingCategory">
                <span className="categoryScore">4,28</span>
                <span className="categoryLabel">Salario y prestaciones</span>
              </div>
              <div className="ratingCategory">
                <span className="categoryScore">4,06</span>
                <span className="categoryLabel">Oportunidades de carrera</span>
              </div>
              <div className="ratingCategory">
                <span className="categoryScore">4,09</span>
                <span className="categoryLabel">Director general</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default KFCPage;