import { DDP } from 'meteor/ddp';

function alreadyInSimulation() {
  const enclosing = DDP._CurrentInvocation.get();
  return enclosing && enclosing.isSimulation;
}

export default alreadyInSimulation;