import L20nBehavior from './l20n';
import ColumnBehavior from './column';
import ModalBehavior from './modal';
import NotificationBehavior from './notification';
import ContextualBehavior from './contextual';
import WidgetBehavior from './widget';


export default function () {
    return {
        l20n: L20nBehavior,
        column: ColumnBehavior,
        modal: ModalBehavior,
        notification: NotificationBehavior,
        contextual: ContextualBehavior,
        widget: WidgetBehavior,
    };
}
