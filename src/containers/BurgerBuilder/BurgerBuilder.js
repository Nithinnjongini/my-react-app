import React ,{Component} from 'react';
import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Model/Modal';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES ={
    salad: 0.5,
    cheese: 0.3,
    becon: 0.8,
    meat: 1.5
    
}

class BurgerBuilder extends Component {

    state ={
        ingredients : null,
        totalPrice : 4,
        purchaseable: false,
        purchasing:false,
        loading:false,
        error:false
    }

    componentDidMount(){
        axios.get('https://react-my-burger-bfbe7.firebaseio.com/ingredients.json')
            .then(response =>{
                this.setState({ingredients: response.data});
            })
            .catch(error => {
                this.setState({error : true})
            }) ;
    }

    updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum,el) => {
                return sum+el;
            } , 0);

        this.setState({purchaseable: sum >0});
    }
    addIngredientHandler = (type) => {
        const oldCount= this.state.ingredients[type];
        const updatedCount = oldCount+1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type]=updatedCount;

        const priceAddition=INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice=oldPrice+priceAddition;
        this.setState({totalPrice: newPrice , ingredients: updatedIngredients});

        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {

        const oldCount= this.state.ingredients[type];
        if(oldCount<=0){
            return;
        }
        const updatedCount = oldCount-1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type]=updatedCount;

        const priceAddition=INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice=oldPrice-priceAddition;
        this.setState({totalPrice: newPrice , ingredients: updatedIngredients});

        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler =() => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.setState({loading:true})  
        const orders= {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Nithin Joseph',
                address: {
                    street :'9851 Harrison Rd',
                    pin: '32431',
                    country: 'US'
                }, 
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }

        axios.post('/orders.json',orders)
            .then(response=> {
                this.setState({ loading:false , purchasing: false})
            })
            .catch(error=> {
                this.setState({loading:false , purchasing: false })
            });
    }

    render(){

        const disabledInfo={
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key]= disabledInfo[key] <= 0
        }

        let orderSummary=null; 
        let burger = this.state.error ? <p>Ingredients can't be loaded from database !!!</p> : <Spinner />
        
        if(this.state.ingredients){
            burger= (
                <Aux>
                    <Burger 
                          ingredients = {this.state.ingredients}/>
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        ordered={this.purchaseHandler}
                        purchaseable={this.state.purchaseable}
                        price={this.state.totalPrice}
                    />
                </Aux>
            );
            orderSummary= <OrderSummary 
            ingredients = {this.state.ingredients}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinue={this.purchaseContinueHandler}
            price={this.state.totalPrice} /> 

        }
        if(this.state.loading){
            orderSummary = <Spinner />
        }


       return (
            <Aux>
                <Modal show={this.state.purchasing}
                        modalClosed ={this.purchaseCancelHandler} >
                    {orderSummary}
                 </Modal>
                {burger}
            </Aux>
       )
    }
}

export default withErrorHandler(BurgerBuilder,axios);