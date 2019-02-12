import React,{Component} from 'react';
import Aux from '../../hoc/Aux';
import Button from '../UI/Button/Button'

class OrderSummary extends Component {

    componentWillUpdate(){
        console.log('componentWillUpdate  will update');
    }

    render(){

        const ingredientsSummary=Object.keys(this.props.ingredients)
        .map(igKey => {
            return ( <li key ={igKey}>
                        <span style= {{textTrasnform : 'capitalize'}}> {igKey} </span> : {this.props.ingredients[igKey]} 
                    </li>);
        });

        return (<Aux>
            <h3> Your Order </h3>
            <p> A delicious burger with the following ingredients : </p>
            <ul>
                {ingredientsSummary}
            </ul>
            <p><strong>Total Price :  {this.props.price.toFixed(2)}</strong></p>
            <p>Continue to Checkout ? </p>
            <Button btnType="Danger" clicked={this.props.purchaseCancelled}>CANCEL</Button>
            <Button btnType="Success" clicked={this.props.purchaseContinue}>CHECK OUT</Button>

        </Aux>);
    }

}

export default OrderSummary;