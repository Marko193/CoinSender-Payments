import { merge } from 'lodash';
import Card from './Card';
import Tabs from './Tabs';
import Lists from './Lists';
import Paper from './Paper';
import Input from './Input';
import Button from './Button';
import Select from './Select';
import Tooltip from './Tooltip';
import Backdrop from './Backdrop';
import Datagrid from './Datagrid';
import Typography from './Typography';
import IconButton from './IconButton';
import HelperText from './HelperText';
import Autocomplete from './Autocomplete';
import Checkbox from './Checkbox';
import Table from './Table';
import Switch from './Switch';
import FormControlLabel from './FormControlLabel';

export default function ComponentsOverrides(theme) {
  return merge(
    Card(theme),
    Tabs(theme),
    Lists(theme),
    Paper(theme),
    Input(theme),
    Select(theme),
    Checkbox(theme),
    Button(theme),
    Tooltip(theme),
    Backdrop(theme),
    Datagrid(theme),
    Typography(theme),
    IconButton(theme),
    Autocomplete(theme),
    HelperText(theme),
    Table(theme),
    Switch(theme),
    FormControlLabel(theme),
  );
}
