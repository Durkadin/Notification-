/* OPT-123456 START */
((self) => {
    'use strict';

    const variationId = 'durkadin';
    const storageName = `ins-last-three-visited-product-${ variationId }`;
    const classes = {
        style: `ins-custom-style-${ variationId }`,
        wrapper: `ins-custom-wrapper-${ variationId }`,
        container: `ins-custom-container-${ variationId }`,
        goal: `sp-custom-${ variationId }-1`,
        productEachData: `ins-custom-product-each-data-${ variationId }`,
        productContent: `ins-product-content-${ variationId }`,
        closeButton: `ins-close-button-${ variationId }`,
        closeButtonContainer: `ins-close-button-container-${ variationId }`,
        hide: `ins-hide-${ variationId }`,
        icon: `ins-icon-wrapper-${ variationId }`,
    };
    const lastProduct = Insider.storage.localStorage.get(storageName) ?? [];

    const selectors = Insider.fns.keys(classes).reduce((createdSelector, key) => (
        createdSelector[key] = `.${ classes[key] }`, createdSelector
    ), { productDescription: '.panel-body ul:eq(0)' });

    self.init = () => {

        if (lastProduct.length === 3) {
            self.reset();
            self.buildCSS();
            self.buildHTML();
        }
        self.setEvents();
    };

    self.reset = () => {
        const { style, wrapper, icon } = selectors;

        Insider.dom(`${ style }, ${ wrapper }, ${ icon }`).remove();
    };

    self.buildCSS = () => {
        const { wrapper, container, productEachData, productContent, closeButton,
            hide, icon, closeButtonContainer } = selectors;

        const customStyle =
        `${ wrapper } {
            display: flex;
            position: fixed;
            right: 100px;
            top: 50%;
            width: 400px;
            border: 1px solid #00000060;
            flex-direction: column;
            z-index: 99999;
            border-radius: 20px;
            background-color: #fff;
            overflow: hidden;
        }
        ${ container } {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 10px;
        }
        ${ closeButtonContainer } {
            height: 50px;
            background-color: purple;
            display: flex;
            color: white;
            padding: 5px 20px;
            justify-content: space-between;
            align-items: center;
        }
        ${ closeButtonContainer } p {

            font-size: 24px;
            text-align: center;
            font-weight: 600;
            margin: 0 !important;
        }
        ${ closeButton } {
            border-radius: 50%;
            border: 1px solid black;
            width: 25px;
            color: black;
            text-align: center;
            cursor: pointer;
        }
        ${ productContent } {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        ${ productContent } h1 {
            font-size: 14px
        }
        ${ productContent } p {
            overflow: hidden;
            font-size: 12px;
            height: 35px;
        }
        ${ productEachData } {
            display: flex;
            gap: 20px;
            border: 1px solid grey;
            border-radius: 10px;
            overflow: hidden;
        }
        ${ productEachData } img {
            width: 80px;
            background-size: contain;
        }
        ${ icon } {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background-color: purple;
            display: flex;
            position: fixed;
            justify-content: center;
            right: 10px;
            top: 50%;
            z-index: 9999;
            cursor: pointer;
            align-items: center;
            
        }
        ${ icon } span {
            font-size: 40px;
            color: white;
            top: 0px !important;
            
        }
        ${ hide } {
            display: none !important;
        }`;

        Insider.dom('<style>').addClass(classes.style).html(customStyle).appendTo('head');
    };

    self.buildHTML = () => {
        const { wrapper, container, productEachData, productContent,
            hide, icon, closeButtonContainer } = classes;
        let productList = '';

        lastProduct.forEach((element) => {
            productList +=
            `<a href="${ element.url } "class=${ productEachData }>
                <img src="${ element.img }">
                <div class=${ productContent }>
                    <h1>${ element.name }</h1>
                    <p>${ element.desc }</p>
                </div>
            </a>`;
        });

        const outerHtml =
        `<div class=${ icon }>    
            <span class="glyphicon glyphicon-bell"></span> 
            <span class="glyphicon glyphicon-remove ${ hide }"></span> 

        </div>
        <div class="${ wrapper } ${ hide }">
            <div class="${ closeButtonContainer }">
                 <p > Fırsatlarımızı Keşfedin </p>
            </div>
            <div class="${ container }">
                ${ productList }
            </div>
        </div>`;

        Insider.dom('body').append(outerHtml);
    };

    self.setEvents = () => {
        const { icon, closeButton, wrapper } = selectors;
        const { hide } = classes;

        Insider.eventManager.once(`click.open:pop:up:${ variationId }`, icon, () => {
            Insider.dom(wrapper).toggleClass(hide);
            Insider.dom('.glyphicon-bell').toggleClass(hide);
            Insider.dom('.glyphicon-remove').toggleClass(hide);

        });

        self.setStorage();
    };

    self.setStorage = () => {
        const { productDescription } = selectors;

        if (Insider.systemRules.call('isOnProductPage')) {
            if (lastProduct.length >= 3) {
                lastProduct.shift();
            }

            const { id, name, img, url } = Insider.systemRules.call('getCurrentProduct');
            const desc = Insider.dom(selectors.productDescription).text().trim();
            const lastProductObject = {
                id,
                name: decodeURIComponent(name),
                img,
                url,
                desc
            };

            if (!lastProduct.some((element) => element.id === lastProductObject.id)) {

                lastProduct.push(lastProductObject);

                Insider.storage.localStorage.set({
                    name: storageName,
                    value: lastProduct,
                    expires: Insider.dateHelper.addDay(1)
                });
            }
        }
    };

    self.init();
})({});

true;
/* OPT-123456 END */