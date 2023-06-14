class NavResponse extends HTMLElement{
    constructor() {
        super();
        this.itemDrop = false;
        this.items = {
            hidden: []
        }
        this.rootContainer = this.querySelector('.root-container') ?
            this.querySelector('.root-container') : this;


    }
    connectedCallback(){
        try {
            if(!this.rootContainer.children.length) throw 'Elements not found';
            this.observerContainer(this.rootContainer.children);
            //this.dropMenu();
        } catch (e){
            console.error(e);
        }
    }


    get dropMenu(){

        const dropMenu = document.createElement('ul');
        this.items.hidden
            .reverse()
            .map(item => dropMenu.appendChild(
                item.cloneNode('deep')).classList.remove('hidden')
            );
        return dropMenu;
    }

    elementDrop(items){

        let elementDrop = this.itemDrop;

        if(!elementDrop){
            elementDrop = document.createElement('div');
            elementDrop.classList.add('drop-more');
            this.itemDrop = elementDrop;
            this.rootContainer.after(elementDrop);
        }

        elementDrop.textContent = `Other ${items.length}`;

        if(!this.items.hidden.length && !!elementDrop)
            elementDrop.remove();

        if(!!this.items.hidden.length && elementDrop){
            this.rootContainer.after(elementDrop);
            elementDrop.appendChild(this.dropMenu);
            elementDrop.onclick = (e) => {
                e.target.classList.toggle('active')
            };
        }

    }

    observerContainer(itemsObserve){
        const self = this;
        const observer =  new IntersectionObserver( (entries , observer) => {
            entries.forEach(entry => {
                if(entry.intersectionRatio === 1 ){
                    entry.target.classList.remove('hidden');
                    self.items.hidden = this.items.hidden.filter(hiddenItem => hiddenItem !== entry.target);
                }else{
                    entry.target.classList.add('hidden');
                    self.items.hidden.push(entry.target)
                }
            })

            this.elementDrop(self.items.hidden);

        }, {
            root: this.rootContainer,
            threshold: 1
        }, this);

        Array.from(itemsObserve).map(item => observer.observe(item));
    }

}

customElements.define('nav-response', NavResponse);





