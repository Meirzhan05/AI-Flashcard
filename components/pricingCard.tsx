import { Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, CardActions, Button } from '@mui/material';
import { Check } from '@mui/icons-material';

interface PricingCardProps {
    title: string;
    price: string;
    description: string;
    features: string[];
    popular?: boolean;
    handleSubmit: (price: number) => void;
}

const PricingCard = ({ handleSubmit, title, price, description, features, popular = false }: PricingCardProps) => {
  const numericPrice: number = parseFloat(price.replace('$', ''));
  console.log(numericPrice)
  return (
    <Card raised={popular} sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#111827', borderRadius: '10px' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {description}
        </Typography>
        <Typography variant="h4" component="div" gutterBottom>
          {price}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          per month
        </Typography>
        <List>
          {features.map((feature, index) => (
            <ListItem key={index} disablePadding>
              <ListItemIcon>
                <Check color="primary" />
              </ListItemIcon>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'center'}}>
        <Button fullWidth onClick={() => handleSubmit(numericPrice)} variant='contained' sx={{ backgroundColor: 'white', color: 'black', width: '90%'}}>
          Start Learning
        </Button>
      </CardActions>
    </Card>
  );
}

export default PricingCard;